const result = require('../utils/result');
const brandService = require('../services/brandService');

exports.createBrand = async (req, res) => {
    try {
        const brand = await brandService.createBrand(req.body);
        res.status(201).json(result(0, 'success', brand));
    } catch (error) {
        res.status(400).json(result(1, 'failed', { message: error.message }));
    }
};

exports.getAllBrands = async (req, res) => {
    try {
        const brands = await brandService.getAllBrands();
        res.status(200).json(result(0, 'success', brands));
    } catch (error) {
        res.status(400).json(result(1, 'failed', { message: error.message }));
    }
};

exports.getBrandById = async (req, res) => {
    try {
        const brand = await brandService.getBrandById(req.params.id);
        res.status(200).json(result(0, 'success', brand));
    } catch (error) {
        res.status(404).json(result(1, 'failed', { message: error.message }));
    }
};

exports.updateBrand = async (req, res) => {
    try {
        const brand = await brandService.updateBrand(req.params.id, req.body);
        res.status(200).json(result(0, 'success', brand));
    } catch (error) {
        res.status(400).json(result(1, 'failed', { message: error.message }));
    }
};

exports.deleteBrand = async (req, res) => {
    try {
        const message = await brandService.deleteBrand(req.params.id);
        res.status(200).json(result(0, 'success', { message }));
    } catch (error) {
        res.status(404).json(result(1, 'failed', { message: error.message }));
    }
};