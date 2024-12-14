const express = require('express');
const reviewController = require('../controllers/reviewController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authenticate, reviewController.createReview);
router.get('/', authenticate, reviewController.getAllReviews);
router.get('/product/:product_id', authenticate, reviewController.getReviewsByProductId);
router.get('/user/:user_id', authenticate, reviewController.getReviewsByUserId);
router.get('/:id', authenticate, reviewController.getReviewById);
router.put('/:id', authenticate, reviewController.updateReview);
router.delete('/:id', authenticate, reviewController.deleteReview);

module.exports = router;
