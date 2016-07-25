var Account = require(global.__base + '/manager').AccountModel;
var cardsApi = require(global.__orders_base + '/lib/cards');

/**
 * Fetch a card
 */
var fetch = function onFetch(req, res, next) {
	var cardId = req.params.id;

	function onFetchCards(err, cards) {
		if (err) return next(err);
		if (!cards) return res.status(200).json(cards.data);
		return (cards.data) ? res.status(200).json(cards.data) : res.status(200).json(cards);
	}

	Account.findOne({ user: req.user._id }, function onFind(err, account) {
		if (err) return next(err);
		(cardId) ? cardsApi.fetch(account.customer, cardId, onFetchCards) : cardsApi.fetchAll(account.customer, onFetchCards);
	});
};

module.exports = fetch;
