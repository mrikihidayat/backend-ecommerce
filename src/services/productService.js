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

exports.getProductsByBrandId = async (brandId) => {
    const products = await Product.find({ brand_id: brandId }).populate('brand_id').populate('category_id');
    if (!products || products.length === 0) throw new Error('No products found for this brand');
    return products;
};

exports.getProductsByCategoryId = async (categoryId) => {
    const products = await Product.find({ category_id: categoryId }).populate('brand_id').populate('category_id');
    if (!products || products.length === 0) throw new Error('No products found for this category');
    return products;
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
