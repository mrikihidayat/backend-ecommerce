const Shipping = require('../models/shippingModel');

exports.createShipping = async (data) => {
    const allowedAttributes = ['order_id', 'user_id', 'status'];
    const extra1 = {};

    for (const key in data) {
        if (!allowedAttributes.includes(key)) {
            extra1[key] = data[key];
            delete data[key];
        }
    }

    const shipping = new Shipping({ ...data, extra1 });
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

// Get Shipping by User ID
exports.getShippingByUserId = async (userId) => {
    const shippings = await Shipping.find({ user_id: userId });
    if (shippings.length === 0) throw new Error('No shippings found for this user');
    return shippings;
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

    Object.assign(shipping.extra1, extra1Updates);
    Object.assign(shipping, updates);
    return await shipping.save();
};

exports.deleteShipping = async (id) => {
    const shipping = await Shipping.findByIdAndDelete(id);
    if (!shipping) throw new Error('Shipping not found');
    return 'Shipping deleted successfully';
};
