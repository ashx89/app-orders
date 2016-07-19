var Account = require(__base + '/manager').AccountModel;
var customersApi = require(global.__payment_base + '/lib/customers');

/**
 * Fetch customer details
 */
var create = function onFetch(req, res, next) {
	Account.findOne({ user: req.user._id }, function onFind(err, account) {
		customersApi.create(req.user, function onCardCreate(err, customer) {
			if (err) return next(err);
			return res.status(200).json(customer);
		});
	});
};

module.exports = create;
