const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 }
});

const transactionSchema = new mongoose.Schema({
    order_id: { type: String, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product_id: { type: [productSchema], required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
    payment_type: { type: String, required: true },
    bank: { type: String, required: true },
    description: { type: String, required: false },
    extra1: { type: mongoose.Schema.Types.Mixed, default: {} },
    extra2: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

transactionSchema.pre('validate', function (next) {
    if (typeof this.user_id === 'string') {
        this.user_id = mongoose.Types.ObjectId(this.user_id);
    }

    if (Array.isArray(this.product_id)) {
        this.product_id = this.product_id.map(item => ({
            product_id: typeof item.product_id === 'string' ? mongoose.Types.ObjectId(item.product_id) : item.product_id,
            quantity: item.quantity || 1
        }));
    }

    next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
