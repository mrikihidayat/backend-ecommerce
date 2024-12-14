const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: false },
    jenis: { type: String, required: false },
    variant: { type: String, required: false },
    category: { type: String, required: false },
    price: { type: Number, required: false },
    stock: { type: Number, required: false },
    description: { type: String, required: false },
    brand_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: false },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: false },
    image: { type: String, required: false },
    extra1: { type: mongoose.Schema.Types.Mixed, default: {} },
    extra2: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
