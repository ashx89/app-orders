global.__orders_base = __dirname;

var express = require('express');
var app = express();

/**
 * Rest:: Basket
 */
app.post('/basket', require('./lib/basket').update);
app.delete('/basket', require('./lib/basket').delete);

/**
 * Rest:: Orders
 */
app.get('/orders', require('./components/orders/fetch'));
app.get('/orders/:id', require('./components/orders/fetch'));

/**
 * Rest:: Card
 */
app.get('/cards', require('./components/cards/fetch'));
app.get('/cards/:id', require('./components/cards/fetch'));
app.post('/cards', require('./components/cards/create'));
app.delete('/cards/:id', require('./components/cards/delete'));

/**
 * Rest:: Customer
 */
app.get('/customers', require('./components/customers/fetch'));
app.post('/customers', require('./components/customers/create'));

module.exports = {
	app: app,
	model: require('./models/order')
};
