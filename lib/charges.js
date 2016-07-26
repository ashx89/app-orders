var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

var charge = {
	/**
	 * Charge a customers stripe account
	 * @param {object} chargeObject. Charge to be applied
	 * @param {function} callback
	 */
	create: function onChargeCreate(cargeObject, callback) {
		stripe.charges.create(cargeObject, function onStripeCreate(err, results) {
			return callback(err, results);
		});
	},

	/**
	 * Fetch a stripe charge
	 * @param {string} chargeId. ID from stripe account
	 * @param {function} callback
	 */
	fetch: function onOrderFetch(data, callback) {
		if (!data) return callback(new Error('Missing Charge ID'), null);

		if (typeof data === 'string') {
			stripe.charges.retrieve(data, function onStripeRetrieve(err, results) {
				return callback(err, results);
			});
		} else if (typeof data === 'object' && data.customer) {
			stripe.charges.list(data, function onStripeList(err, results) {
				return callback(err, results);
			});
		} else {
			return callback(new Error('Invalid Charge or Customer ID'), null);
		}
	}
};

module.exports = charge;
