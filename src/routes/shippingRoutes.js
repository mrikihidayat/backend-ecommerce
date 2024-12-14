const express = require('express');
const shippingController = require('../controllers/shippingController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authenticate, shippingController.createShipping);
router.get('/', authenticate, shippingController.getAllShippings);
router.get('/:id', authenticate, shippingController.getShippingById);
router.put('/:id', authenticate, shippingController.updateShipping);
router.delete('/:id', authenticate, shippingController.deleteShipping);
router.get('/user/:userId', authenticate, shippingController.getShippingByUserId);

module.exports = router;
