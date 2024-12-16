const express = require('express');
const productController = require('../controllers/productController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authenticate, productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/brand/:brandId', productController.getProductsByBrand);
router.get('/category/:categoryId', productController.getProductsByCategory)
router.put('/:id', authenticate, productController.updateProduct);
router.delete('/:id', authenticate, productController.deleteProduct);
router.get('/amount/count', productController.getProductCount);

module.exports = router;
