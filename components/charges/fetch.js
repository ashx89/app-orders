var Account = require(global.__base + '/manager').AccountModel;
var chargesApi = require(global.__orders_base + '/lib/charges');

/**
 * Fetch a charge
 */
var fetch = function onFetch(req, res, next) {
	var chargeId = req.params.id;

	function onFetchCharges(err, charges) {
		if (err) return next(err);
		if (!charges) return res.status(200).json(charges.data);
		return (charges.data) ? res.status(200).json(charges.data) : res.status(200).json(charges);
	}

	Account.findOne({ user: req.user._id }, function onFind(err, account) {
		if (err) return next(err);
		(chargeId) ? chargesApi.fetch(chargeId, onFetchCharges) : chargesApi.fetch({ customer: account.customer }, onFetchCharges);
	});
};

module.exports = fetch;
