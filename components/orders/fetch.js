var _ = require('underscore');

/**
 * Model
 */
var Order = require(global.__orders_base + '/models/order');

/**
 * Fetch a meal
 */
var fetch = function onFetch(req, res, next) {
	var id = req.params.id;

	var query = { user: req.user._id };
	query = _.extend(query, req.query);

	if (id) query = _.extend(query, { _id: id });

	Order.find(query, function onFind(err, doc) {
		if (err) return next(err);
		if (!doc || !doc.length) return next(new Error('No orders found'));

		return (doc.length === 1) ? res.status(200).json(doc[0]) : res.status(200).json(doc);
	});
};

module.exports = fetch;
