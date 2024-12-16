const Review = require('../models/reviewModel');
const Product = require('../models/productModel');

exports.createReview = async (data) => {
    const { product_id, user_id, comment, rate, is_love } = data;

    if (!product_id || !user_id || !rate || rate < 1 || rate > 5) {
        throw new Error('Invalid input. Ensure product_id, user_id, and rate are valid and within range.');
    }

    const product = await Product.findById(product_id);
    if (!product) {
        throw new Error('Product not found');
    }

    const review = new Review({
        product_id,
        user_id,
        comment,
        rate,
        is_love,
    });

    return await review.save();
};

exports.getAllReviews = async () => {
    return await Review.find().populate('product_id user_id');
};

exports.getReviewById = async (id) => {
    const review = await Review.findById(id).populate('product_id user_id');
    if (!review) throw new Error('Review not found');
    return review;
};

exports.getReviewsByProductId = async (product_id) => {
    const reviews = await Review.find({ product_id }).populate('product_id user_id');
    if (!reviews.length) throw new Error('No reviews found for the specified product');
    return reviews;
};

exports.getReviewsByUserId = async (user_id) => {
    const reviews = await Review.find({ user_id }).populate('product_id user_id');
    if (!reviews.length) throw new Error('No reviews found for the specified user');
    return reviews;
};

exports.updateReview = async (id, data) => {
    const { comment, rate, is_love } = data;

    const review = await Review.findById(id);
    if (!review) throw new Error('Review not found');

    if (comment !== undefined) {
        review.comment = comment;
    }

    if (rate !== undefined) {
        if (rate < 1 || rate > 5) throw new Error('Rate must be between 1 and 5');
        review.rate = rate;
    }

    if (is_love !== undefined) {
        review.is_love = is_love;
    }

    return await review.save();
};

exports.calculateAverageRating = async (product_id) => {
    if (!product_id) {
        throw new Error('Product ID is required');
    }

    const reviews = await Review.find({ product_id });

    if (!reviews.length) {
        return 0;
    }

    const totalRate = reviews.reduce((sum, review) => sum + review.rate, 0);
    const averageRate = totalRate / reviews.length;

    return parseFloat(averageRate.toFixed(1));
};


exports.deleteReview = async (id) => {
    const review = await Review.findByIdAndDelete(id);
    if (!review) throw new Error('Review not found');
    return 'Review deleted successfully';
};
