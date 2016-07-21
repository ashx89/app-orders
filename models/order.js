var mongoose = require('mongoose');
var validator = require('mongoose-validator');

var orderSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId },
	status: String,
	name: String,
	email: String,
	customer: String,
	card: String,
	amount: Number,
	currency: String,
	items: Array,
	shipping_address: {}
}, {
	minimize: true,
	timestamps: true
});

orderSchema.set('toJSON', {
	virtuals: true,
	transform: function onTransform(doc, ret) {
		delete ret.id;
		delete ret.__v;
		return ret;
	}
});

module.exports = mongoose.model('Order', orderSchema);
