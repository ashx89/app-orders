var express = require('express');
var app = express();

global.__payment_base = __dirname;

/**
 * Rest:: Card
 */
app.get('/cards', require('./components/cards/fetch'));
app.get('/cards/:id', require('./components/cards/fetch'));
app.post('/cards', require('./components/cards/create'));

module.exports = app;