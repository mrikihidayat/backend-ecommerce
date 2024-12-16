const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

exports.createUser = async (data) => {
    const { name, phone, email, username, password, avatar, role, extra1, extra2, ...rest } = data;

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const user = new User({
        name,
        phone,
        email,
        username,
        password: hashedPassword,
        avatar,
        role: role || 'user',
        extra1: { ...extra1, ...rest },
        extra2: extra2 || {},
    });

    return await user.save();
};

exports.getUsers = async () => {
    return await User.find();
};

exports.getUserById = async (id) => {
    const user = await User.findById(id);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

exports.getUserByEmail = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

exports.getUserByUsername = async (username) => {
    const user = await User.findOne({ username });
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

exports.getUserByEmailOrUsername = async (emailOrUsername) => {
    const user = await User.findOne({
        $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

exports.getUserByToken = async (token) => {
    const user = await User.findOne({ 'extra1._token': token });
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

exports.deleteUser = async (id) => {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        throw new Error('User not found');
    }
    return 'User deleted successfully';
};

exports.updateUser = async (id, data) => {
    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    }

    const user = await User.findById(id);
    if (!user) {
        throw new Error('User not found');
    }

    const allowedAttributes = [
        'name',
        'phone',
        'email',
        'username',
        'password',
        'avatar',
        'role'
    ];

    const modelData = {};
    const extraData = { ...user.extra1 };

    Object.keys(data).forEach((key) => {
        if (allowedAttributes.includes(key)) {
            modelData[key] = data[key];
        } else {
            extraData[key] = data[key];
        }
    });

    user.set(modelData);
    user.extra1 = extraData;

    const updatedUser = await user.save();

    return updatedUser;
};


exports.updateToken = async (id, token) => {
    const user = await User.findById(id);
    if (!user) {
        throw new Error('User not found');
    }

    user.extra1 = user.extra1 || {};
    user.extra1._token = token;
    await user.save();

    return user;
};

exports.removeToken = async (identifier) => {
    let user;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
        user = await User.findById(identifier);
    } else {
        user = await User.findOne({ user_id: identifier });
    }

    if (!user) {
        throw new Error('User not found');
    }

    user.extra1 = user.extra1 || {};
    user.extra1._token = null;
    await user.save();

    return user;
};
