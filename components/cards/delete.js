var Account = require('app-accounts').model;
var cardsApi = require(global.__orders_base + '/lib/cards');

/**
 * Remove a card
 */
var remove = function onFetch(req, res, next) {
	var cardId = req.params.id;

	Account.findOne({ user: req.user._id }, function onFind(err, account) {
		if (err) return next(err);

		cardsApi.fetchAll(account.customer, function onFetch(err, cards) {
			if (err) return next(err);
			if (!cards.data.length) return res.status(200).json({});
			if (cards.data.length === 1) return next(new Error('There must be at least one card on your account'));

			cardsApi.delete(account.customer, cardId, function onDelete(err, results) {
				if (err) return next(err);
				return res.status(200).json(results);
			});
		});
	});
};

module.exports = remove;
