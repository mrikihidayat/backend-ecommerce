const bcrypt = require('bcryptjs');
const { generateToken, validateToken } = require('../utils/jwt');
const { addTokenToBlacklist, isTokenBlacklisted } = require('../services/tokenService');
const sendEmail = require('../utils/email');
const userService = require('./userService');

exports.registerUser = async (data) => {
    const { name, phone, email, username, password, avatar, role } = data;

    try {
        await userService.getUserByEmailOrUsername(email);
        throw new Error('Email or Username already exists');
    } catch (error) {
        if (error.message !== 'User not found') throw error;
    }

    return await userService.createUser({
        name,
        phone,
        email,
        username,
        password,
        avatar,
        role: 'user',
    });
};

exports.signinUser = async (data) => {
    const { username, email, password } = data;

    const user = username
        ? await userService.getUserByUsername(username)
        : await userService.getUserByEmail(email);

    if (!user) {
        throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    const token = generateToken({ id: user._id });

    return { ...user.toObject(), token };
};

exports.signoutUser = async (token) => {
    if (!token) {
        throw new Error('Token is required');
    }

    try {
        const decoded = validateToken(token);
        const isBlacklisted = await isTokenBlacklisted(token);

        if (!isBlacklisted) {
            const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
            if (expiresIn > 0) {
                await addTokenToBlacklist(token, expiresIn);
            }
        }

        return 'Signout successful';
    } catch (error) {
        if (error.message === 'Token expired') {
            throw new Error('Token already expired');
        }
        throw error;
    }
};

exports.googleAuthCallbackService = async (googleUser) => {
    if (!googleUser) {
        throw new Error('Google user not found');
    }

    const user = await User.findById(googleUser.id);
    if (!user) {
        throw new Error('User not found');
    }

    const token = generateToken({ id: user._id });
    return { user, token };
};

exports.requestPasswordReset = async (email, baseRedirectUrl) => {
    const user = await userService.getUserByEmail(email);

    if (!user) {
        throw new Error('User not found');
    }

    const token = generateToken({ id: user._id });

    const resetLink = `${baseRedirectUrl}?token=${token}`;

    const emailContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
            <h1 style="color: #4CAF50; text-align: center;">Password Reset</h1>
            <p style="text-align: center;">
                Click the button below to reset your password:
            </p>
            <div style="text-align: center; margin: 20px 0;">
                <a href="${resetLink}" style="
                    display: inline-block;
                    padding: 12px 20px;
                    font-size: 16px;
                    color: #fff;
                    background-color: #4CAF50;
                    text-decoration: none;
                    border-radius: 5px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    transition: background-color 0.3s ease;
                " target="_blank">Reset Password</a>
            </div>
            <p style="text-align: center; color: #555;">
                If the button above doesn't work, copy and paste the link below into your browser:
            </p>
            <p style="text-align: center; word-break: break-word;">
                <a href="${resetLink}" style="color: #4CAF50;">${resetLink}</a>
            </p>
            <p style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">
                If you did not request this password reset, you can safely ignore this email.
            </p>
        </div>
    `;


    await sendEmail({
        to: email,
        subject: 'Reset Your Password',
        html: emailContent,
    });

    return 'Reset link sent to email';
};


exports.resetPassword = async (token, newPassword, retypePassword) => {
    if (newPassword !== retypePassword) {
        throw new Error('Passwords do not match');
    }

    try {
        const decoded = validateToken(token);
        const user = await userService.getUserById(decoded.id);

        if (!user) {
            throw new Error('User not found');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
        if (expiresIn > 0) {
            await addTokenToBlacklist(token, expiresIn);
        }

        return 'Password reset successful';
    } catch (error) {
        if (error.message === 'Token expired') {
            throw new Error('Token expired. Please request a new password reset.');
        }
        throw error;
    }
};



