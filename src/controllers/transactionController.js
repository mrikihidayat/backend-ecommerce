const result = require('../utils/result');
const transactionService = require('../services/transactionService');

exports.createTransaction = async (req, res) => {
    try {
        const { product_id } = req.body;

        if (!Array.isArray(product_id) || product_id.length === 0) {
            return res.status(400).json(result(1, 'failed', { message: 'Invalid product_id: Must be a non-empty array of products with product_id and quantity.' }));
        }

        const transaction = await transactionService.createTransaction(req.body);
        res.status(201).json(result(0, 'success', transaction));
    } catch (error) {
        res.status(400).json(result(1, 'failed', { message: error.message }));
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await transactionService.getAllTransactions();
        res.status(200).json(result(0, 'success', transactions));
    } catch (error) {
        res.status(500).json(result(1, 'failed', { message: error.message }));
    }
};

exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await transactionService.getTransactionById(req.params.id);
        res.status(200).json(result(0, 'success', transaction));
    } catch (error) {
        res.status(404).json(result(1, 'failed', { message: error.message }));
    }
};

exports.updateTransaction = async (req, res) => {
    try {
        const transaction = await transactionService.updateTransaction(req.params.id, req.body);
        res.status(200).json(result(0, 'success', transaction));
    } catch (error) {
        res.status(400).json(result(1, 'failed', { message: error.message }));
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const message = await transactionService.deleteTransaction(req.params.id);
        res.status(200).json(result(0, 'success', { message }));
    } catch (error) {
        res.status(404).json(result(1, 'failed', { message: error.message }));
    }
};

exports.getTransactionStatus = async (req, res) => {
    try {
        const status = await transactionService.getTransactionStatus(req.params.orderId);
        res.status(200).json(result(0, 'success', status));
    } catch (error) {
        res.status(404).json(result(1, 'failed', { message: error.message }));
    }
};

exports.getSupportedBanks = async (req, res) => {
    try {
        const banks = transactionService.getSupportedBanks();
        res.status(200).json(result(0, 'success', banks));
    } catch (error) {
        res.status(500).json(result(1, 'failed', { message: error.message }));
    }
};

exports.countTransactions = async (req, res) => {
    try {
        const count = await transactionService.countTransactions();
        res.status(200).json(result(0, 'success', { count }));
    } catch (error) {
        res.status(500).json(result(1, 'failed', { message: error.message }));
    }
};

exports.downloadTransactionReport = async (req, res) => {
    try {
        const csv = await transactionService.downloadTransactionReport();
        res.setHeader('Content-Disposition', 'attachment; filename=transactions_report.csv');
        res.setHeader('Content-Type', 'text/csv');
        res.send(csv);
    } catch (error) {
        res.status(500).json({ status: 1, message: error.message });
    }
};