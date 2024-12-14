const Category = require('../models/categoryModel');

exports.createCategory = async (data) => {
    const allowedAttributes = ['name', 'description', 'image'];
    const extra1 = {};

    for (const key in data) {
        if (!allowedAttributes.includes(key)) {
            extra1[key] = data[key];
            delete data[key];
        }
    }

    const category = new Category({ ...data, extra1 });
    return await category.save();
};

exports.getAllCategories = async () => {
    return await Category.find();
};

exports.getCategoryById = async (id) => {
    const category = await Category.findById(id);
    if (!category) throw new Error('Category not found');
    return category;
};

exports.updateCategory = async (id, data) => {
    const allowedAttributes = ['name', 'description', 'image'];
    const extra1Updates = {};
    const updates = {};

    for (const key in data) {
        if (allowedAttributes.includes(key)) {
            updates[key] = data[key];
        } else {
            extra1Updates[key] = data[key];
        }
    }

    const category = await Category.findById(id);
    if (!category) throw new Error('Category not found');

    Object.assign(category.extra1, extra1Updates);
    Object.assign(category, updates);
    return await category.save();
};

exports.deleteCategory = async (id) => {
    const category = await Category.findByIdAndDelete(id);
    if (!category) throw new Error('Category not found');
    return 'Category deleted successfully';
};
