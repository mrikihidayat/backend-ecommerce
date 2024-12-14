const jwt = require('jsonwebtoken');

const generateToken = (payload, expiresIn = '24h') => {
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn });
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

module.exports = { generateToken, validateToken };
