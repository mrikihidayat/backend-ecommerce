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

    const total = product.price * quantity;

    const cartItem = new Cart({
        product_id,
        user_id,
        quantity,
        total
    });

    return await cartItem.save();
};

exports.getAllCartItems = async () => {
    return await Cart.find().populate('product_id user_id');
};

exports.getCartItemById = async (id) => {
    const cartItem = await Cart.findById(id).populate('product_id user_id');
    if (!cartItem) throw new Error('Cart item not found');
    return cartItem;
};

exports.getCartItemsByUserId = async (user_id) => {
    const cartItems = await Cart.find({ user_id }).populate('product_id user_id');
    if (!cartItems.length) throw new Error('No cart items found for the specified user');
    return cartItems;
};

exports.updateCartItem = async (id, data) => {
    const { product_id, quantity } = data;

    const cartItem = await Cart.findById(id);
    if (!cartItem) throw new Error('Cart item not found');

    if (product_id) {
        const product = await Product.findById(product_id);
        if (!product) throw new Error('Product not found');
        cartItem.product_id = product_id;
    }

    if (quantity) {
        if (quantity < 1) throw new Error('Quantity must be at least 1');
        const product = await Product.findById(cartItem.product_id);
        if (!product) throw new Error('Product not found');
        cartItem.quantity = quantity;
        cartItem.total = product.price * quantity;
    }

    return await cartItem.save();
};

exports.deleteCartItem = async (id) => {
    const cartItem = await Cart.findByIdAndDelete(id);
    if (!cartItem) throw new Error('Cart item not found');
    return 'Cart item deleted successfully';
};
