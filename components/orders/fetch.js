var Account = require(global.__base + '/manager').AccountModel;
var ordersApi = require(global.__orders_base + '/lib/orders');

/**
 * Fetch an order
 */
var fetch = function onFetch(req, res, next) {
	var orderId = req.params.id;

	function onFetchOrders(err, orders) {
		if (err) return next(err);
		if (!orders) return res.status(200).json(orders.data);
		return (orders.data) ? res.status(200).json(orders.data) : res.status(200).json(orders);
	}

	Account.findOne({ user: req.user._id }, function onFind(err, account) {
		if (err) return next(err);
		(orderId) ? ordersApi.fetch(orderId, onFetchOrders) : ordersApi.fetchAll({ customer: account.customer }, onFetchOrders);
	});
};

module.exports = fetch;
