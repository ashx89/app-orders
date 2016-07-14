var cardsApi = require(__payment_base + '/lib/cards');

/**
 * Remove a card
 */
var remove = function onFetch(req, res, next) {
	var cardId = req.params.id;
	var customerId = req.user.customer_id;

	cardsApi.fetchAll(customerId, function onFetch(err, cards) {
		if (err) return next(err);
		if (!cards.length) return res.status(200).json({});
		if (cards.length === 1) return next(new Error('There is only one card on your account. Cannot remove'));

		cardsApi.delete(customerId, cardId, function onDelete(err, results) {
			if (err) return next(err);
			return res.status(200).json(results);
		});
	});
};

module.exports = remove;
