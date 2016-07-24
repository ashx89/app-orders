var _ = require('underscore');
var async = require('async');

var User = require(global.__base + '/manager').UserModel;
var Account = require(global.__base + '/manager').AccountModel;
var Product = require(global.__base + '/manager').ProductModel;

var ordersApi = require(global.__orders_base + '/lib/orders');
var customersApi = require(global.__orders_base + '/lib/customers');

/**
 * Create and order
 */
var create = function onCreate(req, res, next) {
	if (!req.body.supplierId) return next(new Error('Missing Supplier ID'));
	if (!req.body.items.length) return next(new Error('No items added to order'));

	var order = {
		items: [],
		shipping: {},
		metadata: {
			supplier: {}
		}
	};

	order.metadata.note = req.body.note || '';
	order.metadata.user = req.user._id;
	order.metadata.name = req.user.fullname;

	order.email = req.user.email;

	async.waterfall([
		function getCustomerAccount(callback) {
			Account.findOne({ user: req.user._id }, function onFind(err, account) {
				if (err) return callback(err);

				order.shipping.name = req.body.name || req.user.fullname;
				order.shipping.address = req.body.address ||
					_.pick(account.address, 'line1', 'line2', 'city', 'zipcode', 'postal_code', 'country');

				order.customer = account.customer;
				order.currency = account.currency || 'gbp';

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

				order.metadata.supplier.user = account.user;
				order.metadata.supplier.account = account._id;
				order.metadata.supplier.address = account.address;
				order.metadata.supplier.storename = account.storename || undefined;

				return callback(null, order);
			});
		},
		function getSupplierUserDetails(order, callback) {
			User.findOne({ _id: order.metadata.supplier.user }, function onSupplierUserFind(err, user) {
				if (err) return callback(err);

				order.metadata.supplier.name = user.fullname;
				order.metadata.supplier.email = user.email;

				return callback(null, order);
			});
		},
		function calculateTotalPrice(order, callback) {
			var tasks = [];

			for (var i = 0; i < req.body.items.length; ++i) {
				(function loopEachOrderItem(item) {
					tasks.push(function onEachProductFetch(done) {
						Product.findOne({ _id: item._id }, function onProductFind(err, product) {
							if (err) return done(err);

							order.items.push({
								amount: product.price,
								currency: order.currency,
								description: product.title
							});

							return done(null, product.price);
						});
					});
				})(req.body.items[i]);
			}

			if (!tasks.length) return callback(new Error('No items added to order'));

			async.parallel(tasks, function onPricesFetchComplete(err, prices) {
				if (err) return callback(err);

				order.amount = prices.reduce(function onReduce(a, b) { return a + b; }, 0);

				if (process.env.APPLICATION_ORDER_PERCENTAGE_FEE) {
					order.amount += (process.env.APPLICATION_ORDER_PERCENTAGE_FEE * order.amount) / 100;
				}

				return callback(null, order);
			});
		}
	], function onComplete(err, order) {
		if (err) return next(err);

		ordersApi.create(order, function onOrderCreate(err, result) {
			if (err) return next(err);
			return res.status(200).json(result);
		});
	});
};

module.exports = create;
