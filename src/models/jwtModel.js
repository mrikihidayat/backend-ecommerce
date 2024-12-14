const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true, 
});

const TokenJWT = mongoose.model('TokenJWT', tokenSchema);

module.exports = TokenJWT;
