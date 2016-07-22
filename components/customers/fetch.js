var Account = require(__base + '/manager').AccountModel;
var customersApi = require(global.__orders_base + '/lib/customers');

/**
 * Fetch customer details
 */
var fetch = function onFetch(req, res, next) {
	Account.findOne({ user: req.user._id }, function onFind(err, account) {
		if (err) return next(err);
		customersApi.fetch(account.customer_id, function onFetchCustomer(err, customer) {
			if (err) return next(err);
			return res.status(200).json(customer);
		});
	});
};

module.exports = fetch;
