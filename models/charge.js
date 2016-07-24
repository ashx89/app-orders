var mongoose = require('mongoose');
var validator = require('mongoose-validators');

var chargeSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId },
	customer: {
		type: String,
		required: [true, 'Missing Customer ID']
	},
	order: {
		type: String,
		required: [true, 'Missing Order ID']
	},
	card: {
		type: String,
		required: [true, 'Missing Card ID']
	},
	status: String,
	receipt_email: String,
	refunded: Boolean,
	refunded_amount: Number,
	description: String,
	currency: String,
	amount: {
		type: Number,
		default: 0,
		required: [true, 'Missing Charge Amount']
	},
	paid: Boolean,
	note: String
}, {
	minimize: true,
	timestamps: true
});

chargeSchema.set('toJSON', {
	virtuals: true,
	transform: function onTransform(doc, ret) {
		delete ret.id;
		delete ret.__v;
		return ret;
	}
});

module.exports = mongoose.model('Charge', chargeSchema);
