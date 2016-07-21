global.__order_base = __dirname;

var express = require('express');
var app = express();

/**
 * Rest:: Orders
 */
app.get('/orders', require('./components/orders/fetch'));
// app.post('/orders', require('./components/orders/create'));

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
