const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        comment: { type: String, required: false },
        rate: { type: Number, required: true, min: 1, max: 5 },
        is_love: { type: Boolean, required: false, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
