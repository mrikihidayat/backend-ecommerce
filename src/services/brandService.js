const Brand = require('../models/brandModel');

exports.createBrand = async (data) => {
    const allowedAttributes = ['name', 'tagline', 'description', 'image'];
    const extra1 = {};

    for (const key in data) {
        if (!allowedAttributes.includes(key)) {
            extra1[key] = data[key];
            delete data[key];
        }
    }

    const brand = new Brand({ ...data, extra1 });
    return await brand.save();
};

exports.getAllBrands = async () => {
    return await Brand.find();
};

exports.getBrandById = async (id) => {
    const brand = await Brand.findById(id);
    if (!brand) throw new Error('Brand not found');
    return brand;
};

exports.updateBrand = async (id, data) => {
    const allowedAttributes = ['name', 'tagline', 'description', 'image'];
    const extra1Updates = {};
    const updates = {};

    for (const key in data) {
        if (allowedAttributes.includes(key)) {
            updates[key] = data[key];
        } else {
            extra1Updates[key] = data[key];
        }
    }

    const brand = await Brand.findById(id);
    if (!brand) throw new Error('Brand not found');

    Object.assign(brand.extra1, extra1Updates);
    Object.assign(brand, updates);
    return await brand.save();
};

exports.deleteBrand = async (id) => {
    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) throw new Error('Brand not found');
    return 'Brand deleted successfully';
};