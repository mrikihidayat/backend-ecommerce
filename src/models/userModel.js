const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema(
    {
        user_id: {
            type: Number,
            unique: true,
        },
        name: {
            type: String,
        },
        phone: {
            type: String,
            match: [/^\d{10,15}$/, 'Phone number must contain 10-15 digits'],
        },
        email: {
            type: String,
            unique: true,
            match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
        },
        username: {
            type: String,
            unique: true,
        },
        password: {
            type: String,
        },
        avatar: {
            type: String,
            default: 'https://example.com/default-avatar.png',
        },
        role: {
            type: String,
            default: 'user',
        },
        extra1: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
        extra2: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

userSchema.plugin(AutoIncrement, { inc_field: 'user_id' });

const User = mongoose.model('User', userSchema);

module.exports = User;
