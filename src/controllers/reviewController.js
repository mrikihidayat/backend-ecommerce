const result = require('../utils/result');
const reviewService = require('../services/reviewService');

exports.createReview = async (req, res) => {
    try {
        const review = await reviewService.createReview(req.body);
        res.status(201).json(result(0, 'success', review));
    } catch (error) {
        res.status(400).json(result(1, 'failed', { message: error.message }));
    }
};

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await reviewService.getAllReviews();
        res.status(200).json(result(0, 'success', reviews));
    } catch (error) {
        res.status(400).json(result(1, 'failed', { message: error.message }));
    }
};

exports.getReviewById = async (req, res) => {
    try {
        const review = await reviewService.getReviewById(req.params.id);
        res.status(200).json(result(0, 'success', review));
    } catch (error) {
        res.status(404).json(result(1, 'failed', { message: error.message }));
    }
};

exports.getReviewsByProductId = async (req, res) => {
    try {
        const reviews = await reviewService.getReviewsByProductId(req.params.product_id);
        res.status(200).json(result(0, 'success', reviews));
    } catch (error) {
        res.status(404).json(result(1, 'failed', { message: error.message }));
    }
};

exports.getReviewsByUserId = async (req, res) => {
    try {
        const reviews = await reviewService.getReviewsByUserId(req.params.user_id);
        res.status(200).json(result(0, 'success', reviews));
    } catch (error) {
        res.status(404).json(result(1, 'failed', { message: error.message }));
    }
};

exports.updateReview = async (req, res) => {
    try {
        const review = await reviewService.updateReview(req.params.id, req.body);
        res.status(200).json(result(0, 'success', review));
    } catch (error) {
        res.status(400).json(result(1, 'failed', { message: error.message }));
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const message = await reviewService.deleteReview(req.params.id);
        res.status(200).json(result(0, 'success', { message }));
    } catch (error) {
        res.status(404).json(result(1, 'failed', { message: error.message }));
    }
};
