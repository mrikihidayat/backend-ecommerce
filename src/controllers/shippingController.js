const result = require('../utils/result');
const shippingService = require('../services/shippingService');

exports.createShipping = async (req, res) => {
    try {
        const shipping = await shippingService.createShipping(req.body);
        res.status(201).json(result(0, 'success', shipping));
    } catch (error) {
        res.status(400).json(result(1, 'failed', { message: error.message }));
    }
};

exports.getAllShippings = async (req, res) => {
    try {
        const shippings = await shippingService.getAllShippings();
        res.status(200).json(result(0, 'success', shippings));
    } catch (error) {
        res.status(400).json(result(1, 'failed', { message: error.message }));
    }
};

exports.getShippingById = async (req, res) => {
    try {
        const shipping = await shippingService.getShippingById(req.params.id);
        res.status(200).json(result(0, 'success', shipping));
    } catch (error) {
        res.status(404).json(result(1, 'failed', { message: error.message }));
    }
};

exports.getShippingByUserId = async (req, res) => {
    try {
        const shippings = await shippingService.getShippingByUserId(req.params.userId);
        res.status(200).json(result(0, 'success', shippings));
    } catch (error) {
        res.status(404).json(result(1, 'failed', { message: error.message }));
    }
};

exports.updateShipping = async (req, res) => {
    try {
        const shipping = await shippingService.updateShipping(req.params.id, req.body);
        res.status(200).json(result(0, 'success', shipping));
    } catch (error) {
        res.status(400).json(result(1, 'failed', { message: error.message }));
    }
};

exports.deleteShipping = async (req, res) => {
    try {
        const message = await shippingService.deleteShipping(req.params.id);
        res.status(200).json(result(0, 'success', { message }));
    } catch (error) {
        res.status(404).json(result(1, 'failed', { message: error.message }));
    }
};
