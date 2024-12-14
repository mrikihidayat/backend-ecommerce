const result = require('../utils/result');
const cartService = require('../services/cartService');

exports.createCartItem = async (req, res) => {
    try {
        const cartItem = await cartService.createCartItem(req.body);
        res.status(201).json(result(0, 'success', cartItem));
    } catch (error) {
        res.status(400).json(result(1, 'failed', { message: error.message }));
    }
};

exports.getAllCartItems = async (req, res) => {
    try {
        const cartItems = await cartService.getAllCartItems();
        res.status(200).json(result(0, 'success', cartItems));
    } catch (error) {
        res.status(400).json(result(1, 'failed', { message: error.message }));
    }
};

exports.getCartItemById = async (req, res) => {
    try {
        const cartItem = await cartService.getCartItemById(req.params.id);
        res.status(200).json(result(0, 'success', cartItem));
    } catch (error) {
        res.status(404).json(result(1, 'failed', { message: error.message }));
    }
};

exports.getCartItemsByUserId = async (req, res) => {
    try {
        const cartItems = await cartService.getCartItemsByUserId(req.params.user_id);
        res.status(200).json(result(0, 'success', cartItems));
    } catch (error) {
        res.status(404).json(result(1, 'failed', { message: error.message }));
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const cartItem = await cartService.updateCartItem(req.params.id, req.body);
        res.status(200).json(result(0, 'success', cartItem));
    } catch (error) {
        res.status(400).json(result(1, 'failed', { message: error.message }));
    }
};

exports.deleteCartItem = async (req, res) => {
    try {
        const message = await cartService.deleteCartItem(req.params.id);
        res.status(200).json(result(0, 'success', { message }));
    } catch (error) {
        res.status(404).json(result(1, 'failed', { message: error.message }));
    }
};
