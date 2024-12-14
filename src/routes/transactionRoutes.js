const express = require('express');
const transactionController = require('../controllers/transactionController');
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create', authenticate, transactionController.createTransaction);
router.get('/get', authenticate, transactionController.getAllTransactions);
router.get('/get/:id', authenticate, transactionController.getTransactionById);
router.put('/update/:id', authenticate, transactionController.updateTransaction);
router.delete('/delete/:id', authenticate, transactionController.deleteTransaction);
router.get('/status/:orderId', authenticate, transactionController.getTransactionStatus);
router.get('/supported-banks', authenticate, transactionController.getSupportedBanks);

module.exports = router;
