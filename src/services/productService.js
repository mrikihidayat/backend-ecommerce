const Product = require('../models/productModel');
const Brand = require('../models/brandModel');
const Category = require('../models/categoryModel');

exports.createProduct = async (data) => {
    const allowedAttributes = ['name', 'jenis', 'variant', 'category', 'price', 'stock', 'description', 'brand_id', 'category_id', 'image'];
    const extra1 = {};

    for (const key in data) {
        if (!allowedAttributes.includes(key)) {
            extra1[key] = data[key];
            delete data[key];
        }
    }

    if (data.brand_id) {
        const brandExists = await Brand.findById(data.brand_id);
        if (!brandExists) throw new Error('Invalid brand_id');
    }

    if (data.category_id) {
        const categoryExists = await Category.findById(data.category_id);
        if (!categoryExists) throw new Error('Invalid category_id');
    }

    if (data.image && typeof data.image !== 'string') {
        throw new Error('Image must be a base64 string');
    }

    const product = new Product({ ...data, extra1 });
    return await product.save();
};

exports.getAllProducts = async () => {
    return await Product.find().populate('brand_id').populate('category_id');
};

exports.getProductById = async (id) => {
    const product = await Product.findById(id).populate('brand_id').populate('category_id');
    if (!product) throw new Error('Product not found');
    return product;
};

exports.updateProduct = async (id, data) => {
    const allowedAttributes = ['name', 'jenis', 'variant', 'category', 'price', 'stock', 'description', 'brand_id', 'category_id', 'image'];
    const extra1Updates = {};
    const updates = {};

    for (const key in data) {
        if (allowedAttributes.includes(key)) {
            updates[key] = data[key];
        } else {
            extra1Updates[key] = data[key];
        }
    }

    if (data.brand_id) {
        const brandExists = await Brand.findById(data.brand_id);
        if (!brandExists) throw new Error('Invalid brand_id');
    }

    if (data.category_id) {
        const categoryExists = await Category.findById(data.category_id);
        if (!categoryExists) throw new Error('Invalid category_id');
    }

    if (data.image && typeof data.image !== 'string') {
        throw new Error('Image must be a base64 string');
    }

    const product = await Product.findById(id);
    if (!product) throw new Error('Product not found');

    Object.assign(product.extra1, extra1Updates);
    Object.assign(product, updates);
    return await product.save();
};

exports.deleteProduct = async (id) => {
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new Error('Product not found');
    return 'Product deleted successfully';
};

exports.getProductsByBrand = async (brandId) => {
    try {
        return await Product.find({ brand_id: brandId });
    } catch (error) {
        throw new Error(`Failed to get products by brand. Reason: ${error.message}`);
    }
};

exports.getProductsByCategory = async (categoryId) => {
    try {
        return await Product.find({ category_id: categoryId });
    } catch (error) {
        throw new Error(`Failed to get products by category. Reason: ${error.message}`);
    }
};

exports.countProduct = async () => {
    try {
        const count = await Product.countDocuments();
        return count;
    } catch (error) {
        throw new Error(`Failed to count product. Reason: ${error.message}`);
    }
};