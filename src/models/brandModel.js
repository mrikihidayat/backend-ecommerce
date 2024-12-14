const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    name: { type: String, required: true },
    tagline: { type: String, required: false },
    description: { type: String, required: false },
    image: { type: String, required: false },
    extra1: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('Brand', brandSchema);