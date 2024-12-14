const { validateToken, isTokenBlacklisted } = require('../services/tokenService');
const result = require('../utils/result');

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json(result(1, 'failed', { message: 'Unauthorized: Missing or invalid token' }));
    }

    const token = authHeader.split(' ')[1];

    try {
        const isBlacklisted = await isTokenBlacklisted(token);
        if (isBlacklisted) {
            return res.status(401).json(result(1, 'failed', { message: 'Token is blacklisted. Please log in again.' }));
        }

        const decoded = validateToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        const message =
            error.name === 'TokenExpiredError'
                ? 'Token expired. Please log in again.'
                : 'Invalid token. Please log in again.';
        return res.status(401).json(result(1, 'failed', { message }));
    }
};

module.exports = authenticate;
