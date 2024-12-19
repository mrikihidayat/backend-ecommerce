const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

exports.createCartItem = async (data) => {
    const { product_id, user_id, quantity } = data;

    if (!product_id || !user_id || !quantity || quantity < 1) {
        throw new Error('Invalid input. Ensure product_id, user_id, and quantity are valid.');
    }

    const product = await Product.findById(product_id);
    if (!product) {
        throw new Error('Product not found');
    }

    // Cek apakah item sudah ada di keranjang
    const existingCartItem = await Cart.findOne({ product_id, user_id });
    if (existingCartItem) {
        // Jika ada, update jumlah dan total
        existingCartItem.quantity += quantity;
        existingCartItem.total = product.price * existingCartItem.quantity;
        return await existingCartItem.save();
    }

    const total = product.price * quantity;

    const cartItem = new Cart({
        product_id,
        user_id,
        quantity,
        total
    });

    return await cartItem.save();
};

exports.updateCartItem = async (id, data) => {
    const { product_id, quantity } = data;

    const cartItem = await Cart.findById(id);
    if (!cartItem) throw new Error('Cart item not found');

    if (quantity) {
        if (quantity < 1) throw new Error('Quantity must be at least 1');
        const product = await Product.findById(cartItem.product_id);
        if (!product) throw new Error('Product not found');
        cartItem.quantity = quantity;
        cartItem.total = product.price * quantity;
    }

    return await cartItem.save();
};