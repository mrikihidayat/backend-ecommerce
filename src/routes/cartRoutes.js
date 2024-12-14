const express = require('express');
const cartController = require('../controllers/cartController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authenticate, cartController.createCartItem);
router.get('/', authenticate, cartController.getAllCartItems);
router.get('/user/:user_id', authenticate, cartController.getCartItemsByUserId);
router.get('/:id', authenticate, cartController.getCartItemById);
router.put('/:id', authenticate, cartController.updateCartItem);
router.delete('/:id', authenticate, cartController.deleteCartItem);

module.exports = router;
