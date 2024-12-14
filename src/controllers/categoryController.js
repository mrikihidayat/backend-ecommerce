const result = require('../utils/result');
const categoryService = require('../services/categoryService');

exports.createCategory = async (req, res) => {
    try {
        const category = await categoryService.createCategory(req.body);
        res.status(201).json(result(0, 'success', category));
    } catch (error) {
        res.status(400).json(result(1, 'failed', { message: error.message }));
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json(result(0, 'success', categories));
    } catch (error) {
        res.status(400).json(result(1, 'failed', { message: error.message }));
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        res.status(200).json(result(0, 'success', category));
    } catch (error) {
        res.status(404).json(result(1, 'failed', { message: error.message }));
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const category = await categoryService.updateCategory(req.params.id, req.body);
        res.status(200).json(result(0, 'success', category));
    } catch (error) {
        res.status(400).json(result(1, 'failed', { message: error.message }));
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const message = await categoryService.deleteCategory(req.params.id);
        res.status(200).json(result(0, 'success', { message }));
    } catch (error) {
        res.status(404).json(result(1, 'failed', { message: error.message }));
    }
}; 