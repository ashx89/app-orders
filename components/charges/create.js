var async = require('async');

var Account = require(global.__base + '/manager').AccountModel;

var Order = require(global.__orders_base + '/models/order');

var chargesApi = require(global.__orders_base + '/lib/charges');

var create = function onCreate(req, res, next) {
	if (!req.body.orderId) return next(new Error('No Order ID Found'));

	var charge = {};

	async.waterfall([
		function getOrderDetails(callback) {

		}
	], function onComplete(err, charge) {

	});

	Account.findOne({ user: req.user._id }, function onFind(err, account) {
		if (err) return next(err);

		chargesApi.create(req.body, function onCardCreate(err, charge) {
			if (err) return next(err);
			return res.status(200).json(charge);
		});
	});
};

module.exports = create;
