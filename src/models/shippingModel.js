const mongoose = require('mongoose');

const shippingSchema = new mongoose.Schema({
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'pending' },
    extra1: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

shippingSchema.pre('validate', function (next) {
    if (typeof this.user_id === 'string') {
        this.user_id = mongoose.Types.ObjectId(this.user_id);
    }

    if (typeof this.order_id === 'string') {
        this.order_id = mongoose.Types.ObjectId(this.order_id);
    }

    next();
});

module.exports = mongoose.model('Shipping', shippingSchema);
