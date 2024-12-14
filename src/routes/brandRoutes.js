const express = require('express');
const brandController = require('../controllers/brandController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authenticate, brandController.createBrand);
router.get('/', brandController.getAllBrands);
router.get('/:id', brandController.getBrandById);
router.put('/:id', authenticate, brandController.updateBrand);
router.delete('/:id', authenticate, brandController.deleteBrand);

module.exports = router;