const passport = require('passport');
const result = require('../utils/result');
const { generateToken, validateToken } = require('../utils/jwt');
const {
    registerUser,
    signinUser,
    signoutUser,
    googleAuthCallbackService,
    requestPasswordReset,
    resetPassword,
} = require('../services/authService');
const userService = require('../services/userService');

exports.register = async (req, res) => {
    try {
        const { name, phone, email, username, password } = req.body;

        if (!name || !phone || !email || !username || !password) {
            return res.status(400).json(result(1, 'failed', {
                message: 'Name, phone, email, username, and password are required'
            }));
        }

        const savedUser = await registerUser(req.body);
        res.status(201).json(result(0, 'success', savedUser));
    } catch (error) {
        res.status(400).json(result(1, 'failed', { message: error.message }));
    }
};

exports.signin = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if ((!username && !email) || !password) {
            throw new Error('Missing username or email, and password');
        }

        const userWithToken = await signinUser({ username, email, password });
        res.status(200).json(result(0, 'success', userWithToken));
    } catch (error) {
        res.status(400).json(result(1, 'failed', { message: error.message }));
    }
};

exports.signout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json(result(1, 'failed', { message: 'Missing or invalid token' }));
        }

        const token = authHeader.split(' ')[1];
        const message = await signoutUser(token);
        res.status(200).json(result(0, 'success', { message }));
    } catch (error) {
        res.status(400).json(result(1, 'failed', { message: error.message }));
    }
};

exports.googleAuthStart = async (req, res, next) => {
    try {
        const redirectUrl = req.query.redirect;
        if (!redirectUrl) {
            return res.status(400).json(result(1, 'failed', { message: 'Redirect parameter is required' }));
        }

        res.cookie('redirectUrl', redirectUrl, { httpOnly: true });
        console.log('Redirect URL saved in cookie:', redirectUrl);
        next();
    } catch (error) {
        res.status(400).json(result(1, 'failed', { message: error.message }));
    }
};

exports.googleAuthCallback = async (req, res) => {
    try {
        if (!req.cookies || !req.cookies.redirectUrl) {
            return res.status(400).json(result(1, 'failed', { message: 'Redirect URL not found in cookies' }));
        }

        const redirectUrl = req.cookies.redirectUrl;
        const profile = req.user;

        let user = await userService.getUserByEmail(profile.email);

        if (!user) {
            user = await userService.createUser({
                name: profile.name,
                email: profile.email,
                avatar: profile.avatar,
                username: profile.id,
                password: null, 
                role: 'user',
            });
        }

        const token = generateToken({ id: user._id });

        res.clearCookie('redirectUrl');
        return res.redirect(`${redirectUrl}?token=${token}`);
    } catch (error) {
        res.status(400).json(result(1, 'failed', { message: error.message }));
    }
};

exports.googleAuthFailure = (req, res) => {
    res.status(401).json(result(1, 'failed', { message: 'Google authentication failed' }));
};

exports.resetPasswordLink = async (req, res) => {
    try {
        const { email, redirectUrl } = req.body;
        if (!email || !redirectUrl) {
            return res.status(400).json(result(1, 'failed', { message: 'Email and redirectUrl are required' }));
        }

        const message = await requestPasswordReset(email, redirectUrl);
        res.status(200).json(result(0, 'success', { message }));
    } catch (error) {
        res.status(400).json(result(1, 'failed', { message: error.message }));
    }
};

exports.resetPasswordProcess = async (req, res) => {
    try {
        const { newPassword, retypePassword } = req.body;
        if (!newPassword || !retypePassword) {
            return res.status(400).json(result(1, 'failed', { message: 'newPassword, and retypePassword are required' }));
        }

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json(result(1, 'failed', { message: 'Missing or invalid token' }));
        }

        const token = authHeader.split(' ')[1];

        const message = await resetPassword(token, newPassword, retypePassword);
        res.status(200).json(result(0, 'success', { message }));
    } catch (error) {
        res.status(400).json(result(1, 'failed', { message: error.message }));
    }
};
