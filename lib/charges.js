var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

var charge = {
	/**
	 * Charge a customers stripe account
	 * @param {object} chargeObject. Charge to be applied
	 * @param {function} callback
	 */
	create: function onChargeCreate(cargeObject, callback) {
		if (!cargeObject.orderId) return callback(new Error('Invalid Order'));

		stripe.charges.create(cargeObject, function onStripeCreate(err, results) {
			return callback(err, results);
		});
	},

	/**
	 * Fetch a stripe charge
	 * @param {string} chargeId. ID from stripe account
	 * @param {function} callback
	 */
	fetch: function onChargeFetch(chargeId, callback) {
		if (!chargeId) return callback(new Error('Invalid Charge ID'), null);

		stripe.charges.retrieve(chargeId, function onStripeRetrieve(err, results) {
			return callback(err, results);
		});
	}
};

module.exports = charge;
