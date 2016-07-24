var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

var order = {
	/**
	 * Create a stripe order
	 * @param {object} orderObject. Charge to be applied
	 * @param {function} callback
	 */
	create: function onOrderCreate(orderObject, callback) {
		stripe.orders.create(orderObject, function onStripeCreate(err, results) {
			return callback(err, results);
		});
	},

	/**
	 * Fetch a stripe order
	 * @param {string} orderId. ID from stripe account
	 * @param {function} callback
	 */
	fetch: function onOrderFetch(orderId, callback) {
		if (!orderId) return callback(new Error('Invalid Order ID'), null);

		stripe.orders.retrieve(orderId, function onStripeRetrieve(err, results) {
			return callback(err, results);
		});
	}
};

module.exports = order;
