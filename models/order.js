var mongoose = require('mongoose');
var validator = require('mongoose-validators');

var orderSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId },
	name: {
		type: String,
		required: [true, 'Missing Name'],
		validate: [validator.isAlpha, 'Invalid Name']
	},
	email: {
		type: String,
		validate: [validator.isEmail, 'Invalid Email']
	},
	shipping_address: {},
	items: Array,
	customer: {
		type: String,
		required: [true, 'Missing Order Customer ID']
	},
	amount: {
		type: Number,
		default: 0,
		required: [true, 'Missing Order Amount']
	},
	currency: String,
	status: {
		type: String,
		default: 'created',
		required: [true, 'Missing Order Status']
	},
	supplier: {
		account: { type: mongoose.Schema.Types.ObjectId },
		storename: String,
		name: String,
		email: String,
		address: {},
	},
	note: String
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
