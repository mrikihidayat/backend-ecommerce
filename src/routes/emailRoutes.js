const express = require('express');
const { sendEmail } = require('../controllers/emailController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

// Send email (Requires authentication)
router.post('/send', authenticate, sendEmail);

module.exports = router;
