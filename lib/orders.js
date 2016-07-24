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
	 * @param {string} data. An order ID or and object for listing all orders
	 * @param {function} callback
	 */
	fetch: function onOrderFetch(data, callback) {
		if (!data) return callback(new Error('Invalid Order ID'), null);

		if (typeof data === 'string') {
			stripe.orders.retrieve(data, function onStripeRetrieve(err, results) {
				return callback(err, results);
			});
		} else if (typeof data === 'object' && data.customer) {
			stripe.orders.list(data, function onStripeList(err, results) {
				return callback(err, results);
			});
		} else {
			return callback(new Error('Invalid Order or Customer ID'), null);
		}
	}
};

module.exports = order;
