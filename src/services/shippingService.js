const Shipping = require('../models/shippingModel');
const mongoose = require('mongoose');

exports.createShipping = async (data) => {
    const allowedAttributes = ['order_id', 'user_id', 'status'];
    const extra1 = {};

    for (const key in data) {
        if (!allowedAttributes.includes(key)) {
            extra1[key] = data[key];
            delete data[key];
        }
    }

    if (typeof data.order_id === 'string' && mongoose.isValidObjectId(data.order_id)) {
        data.order_id = new mongoose.Types.ObjectId(data.order_id);
    }

    if (typeof data.user_id === 'string' && mongoose.isValidObjectId(data.user_id)) {
        data.user_id = new mongoose.Types.ObjectId(data.user_id);
    }

    const existingShipping = await Shipping.findOne({ order_id: data.order_id });

    if (existingShipping) {
        Object.assign(existingShipping.extra1, extra1);
        Object.assign(existingShipping, data);
        return await existingShipping.save();
    } else {
        const shipping = new Shipping({ ...data, extra1 });
        return await shipping.save();
    }
};

exports.updateShipping = async (id, data) => {
    const allowedAttributes = ['order_id', 'user_id', 'status'];
    const extra1Updates = {};
    const updates = {};

    for (const key in data) {
        if (allowedAttributes.includes(key)) {
            updates[key] = data[key];
        } else {
            extra1Updates[key] = data[key];
        }
    }

    const shipping = await Shipping.findById(id);
    if (!shipping) throw new Error('Shipping not found');

    if (updates.order_id && typeof updates.order_id === 'string') {
        if (!mongoose.isValidObjectId(updates.order_id)) {
            throw new Error('Invalid order_id format');
        }
        updates.order_id = new mongoose.Types.ObjectId(updates.order_id);
    }

    if (updates.user_id && typeof updates.user_id === 'string') {
        if (!mongoose.isValidObjectId(updates.user_id)) {
            throw new Error('Invalid user_id format');
        }
        updates.user_id = new mongoose.Types.ObjectId(updates.user_id);
    }

    Object.assign(shipping.extra1, extra1Updates);
    Object.assign(shipping, updates);
    return await shipping.save();
};


exports.getAllShippings = async () => {
    return await Shipping.find();
};

exports.getShippingById = async (id) => {
    const shipping = await Shipping.findById(id);
    if (!shipping) throw new Error('Shipping not found');
    return shipping;
};

exports.getShippingByUserId = async (userId) => {
    const shippings = await Shipping.find({ user_id: mongoose.Types.ObjectId(userId) });
    if (shippings.length === 0) throw new Error('No shippings found for this user');
    return shippings;
};

exports.deleteShipping = async (id) => {
    const shipping = await Shipping.findByIdAndDelete(id);
    if (!shipping) throw new Error('Shipping not found');
    return 'Shipping deleted successfully';
};
