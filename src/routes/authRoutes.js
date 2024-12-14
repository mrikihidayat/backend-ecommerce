const express = require('express');
const passport = require('../config/googleAuth');
const {
    register,
    signin,
    signout,
    googleAuthStart,
    googleAuthCallback,
    googleAuthFailure,
    resetPasswordLink,
    resetPasswordProcess,
} = require('../controllers/authController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

// Register
router.post('/register', register);

// Signin
router.post('/signin', signin);

// Signout
router.post('/signout', authenticate, signout);

router.get('/google', googleAuthStart, passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/api/auth/google/failure' }),
    googleAuthCallback
);

router.get('/google/failure', googleAuthFailure);

// Password Reset Request
router.post('/reset-password', resetPasswordLink);

// Password Reset Process
router.post('/reset-password/process', authenticate, resetPasswordProcess);

module.exports = router;
