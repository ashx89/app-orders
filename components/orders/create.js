var _ = require('underscore');
var async = require('async');

var User = require('app-auth').model;
var Account = require('app-accounts').model;
var Product = require('app-products').model;

var Order = require(global.__orders_base + '/models/order');

var customersApi = require(global.__orders_base + '/lib/customers');

/**
 * Create an order item
 */
var create = function onCreate(req, res, next) {
	var order = new Order(req.body);

	order.url = '/orders/' + order._id;
	order.account = req.user.account;
	order.name = req.user.fullname;
	order.email = req.user.email;

	async.waterfall([
		function getCustomerAccount(callback) {
			Account.findOne({ user: req.user._id }, function onFind(err, account) {
				if (err) return callback(err);

				order.customer = account.customer;
				order.currency = account.currency;
				order.shipping_address = req.body.address || account.address;

				return callback(null, order);
			});
		},
		function createCustomerAccount(order, callback) {
			if (order.customer) return callback(null, order);

			customersApi.create(req.user, function onCreate(err, customer) {
				if (err) return callback(err);

				order.customer = customer.id;

				Account.update(
					{ user: req.user._id },
					{ $set: { customer: customer.id } },
					function onUpdateAccount(err, updatedAccount) {
						if (err) return callback(err);
						return callback(null, order);
					});
			});
		},
		function getSupplierAccountDetails(order, callback) {
			Account.findOne({ _id: req.body.supplierId }, function onSupplierAccountFind(err, account) {
				if (err) return callback(err);

				order.supplier.user = account.user;
				order.supplier.account = account._id;
				order.supplier.address = account.address;
				order.supplier.storename = account.storename || undefined;

				return callback(null, order);
			});
		},
		function getSupplierUserDetails(order, callback) {
			User.findOne({ _id: order.supplier.user }, function onSupplierUserFind(err, user) {
				if (err) return callback(err);

				order.supplier.name = user.fullname;
				order.supplier.email = user.email;

				return callback(null, order);
			});
		},
		function calculateTotalPrice(order, callback) {
			var tasks = [];

			for (var i = 0; i < order.items.length; ++i) {
				(function loopEachOrderItem(item) {
					tasks.push(function onEachProductFetch(done) {
						Product.findOne({ _id: item._id }).lean().exec(function onProductFind(err, product) {
							if (err) return done(err);

							item = _.extend(item, product);
							item.total = item.price * item.qty;

							return done(null, item);
						});
					});
				})(order.items[i]);
			}

			if (!tasks.length) return callback(new Error('No items added to order'));

			async.parallel(tasks, function onPricesFetchComplete(err, products) {
				if (err) return callback(err);

				order.amount = _.pluck(products, 'total').reduce(function onReduce(a, b) { return a + b; }, 0);

				if (process.env.APPLICATION_ORDER_PERCENTAGE_FEE) {
					order.amount += (process.env.APPLICATION_ORDER_PERCENTAGE_FEE * order.amount) / 100;
				}

				return callback(null, order);
			});
		}
	], function onComplete(err, order) {
		if (err) return next(err);

		order.save(function onOrderSave(err) {
			if (err) return next(err);
			return res.status(200).json(order);
		});
	});
};

module.exports = create;
