var Account = require(__base + '/manager').AccountModel;
var cardsApi = require(global.__orders_base + '/lib/cards');

/**
 * Remove a card
 */
var remove = function onFetch(req, res, next) {
	var cardId = req.params.id;

	Account.findOne({ user: req.user._id }, function onFind(err, account) {
		cardsApi.fetchAll(account.customer_id, function onFetch(err, cards) {
			if (err) return next(err);
			if (!cards.data.length) return res.status(200).json({});
			if (cards.data.length === 1) return next(new Error('There is only one card on your account. Cannot remove'));

			cardsApi.delete(account.customer_id, cardId, function onDelete(err, results) {
				if (err) return next(err);
				return res.status(200).json(results);
			});
		});
	});
};

module.exports = remove;
