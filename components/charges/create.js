var async = require('async');

var Order = require(global.__orders_base + '/models/order');

var chargesApi = require(global.__orders_base + '/lib/charges');
var customersApi = require(global.__orders_base + '/lib/customers');

var create = function onCreate(req, res, next) {
	if (!req.body.orderId) return next(new Error('No Order ID Found'));

	var charge = {};
	var orderId = req.body.orderId;

	async.waterfall([
		function getOrderDetails(callback) {
			Order.findOne({ _id: orderId, user: req.user._id }, function onFind(err, order) {
				if (err) return callback(err);
				if (!order) return callback(new Error('The order does not exist'));
				if (order.status === 'completed') return callback(new Error('This order has already been paid'));

				charge.amount = order.amount;
				charge.currency = order.currency;
				(req.body.stripeToken) ? charge.source = req.body.stripeToken : charge.customer = order.customer;
				charge.description = order.description;

				charge.metadata = order.metadata;
				charge.receipt_email = order.email;

				return callback(null, order);
			});
		},
		function validateCharge(order, callback) {
			if (!charge.amount) return callback(new Error('Missing Amount for charge'));
			if (!charge.currency) return callback(new Error('Missing Currency for charge'));
			if (!charge.source && !charge.customer) return callback(new Error('Missing Payment Source for charge'));

			return callback(null, order);
		},
		function saveCardDetailsToUser(order, callback) {
			if (charge.source) {
				customersApi.update(order.customer, { source: charge.source }, function onUpdate(err, customerObject) {
					if (err) return callback(err);

					delete charge.source;
					charge.customer = customerObject.id;

					return callback(null, order);
				});
			} else {
				return callback(null, order);
			}
		},
		function payOrder(order, callback) {
			chargesApi.create(charge, function onCreate(err, chargeResult) {
				if (err) return callback(err);

				order.status = 'completed';
				order.charge = chargeResult.id;

				order.save(function onSave(err) {
					if (err) return callback(err);
					return callback(null, order, chargeResult);
				});
			});
		},
	], function onComplete(err, order, chargeResult) {
		if (err) return next(err);
		return res.status(200).json({ order: order, charge: chargeResult });
	});
};

module.exports = create;
