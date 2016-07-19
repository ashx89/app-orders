global.__payment_base = __dirname;

var mongoose = require('mongoose');
var express = require('express');
var app = express();

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

module.exports = app;
