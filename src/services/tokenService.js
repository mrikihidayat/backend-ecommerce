const TokenJWT = require('../models/jwtModel');
const jwt = require('jsonwebtoken');

const addTokenToBlacklist = async (token, expiresIn) => {
    const existingToken = await TokenJWT.findOne({ token });
    if (!existingToken) {
        const expiresAt = new Date(Date.now() + expiresIn * 1000);
        await TokenJWT.create({ token, expiresAt });
    }
};

const isTokenBlacklisted = async (token) => {
    const blacklistedToken = await TokenJWT.findOne({ token });
    return !!blacklistedToken;
};

const removeExpiredTokens = async () => {
    await TokenJWT.deleteMany({ expiresAt: { $lte: new Date() } });
};

const validateToken = (token) => {
    try {
        return jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token expired');
        }
        if (error.name === 'JsonWebTokenError') {
            throw new Error('Invalid token');
        }
        throw new Error('Token validation failed');
    }
};

module.exports = {
    addTokenToBlacklist,
    isTokenBlacklisted,
    removeExpiredTokens,
    validateToken,
};
