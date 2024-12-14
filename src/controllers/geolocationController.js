const result = require('../utils/result');
const geolocationService = require('../services/geolocationService');

exports.getProvinces = async (req, res) => {
    try {
        const provinces = await geolocationService.getAllProvinces();
        res.status(200).json(result(0, 'success', provinces));
    } catch (error) {
        res.status(400).json(result(1, 'failed', { message: error.message }));
    }
};

exports.getRegencies = async (req, res) => {
    try {
        const regencies = await geolocationService.getRegenciesByProvince(req.params.provinceCode);
        res.status(200).json(result(0, 'success', regencies));
    } catch (error) {
        res.status(400).json(result(1, 'failed', { message: error.message }));
    }
};

exports.getDistricts = async (req, res) => {
    try {
        const districts = await geolocationService.getDistrictsByRegency(req.params.regencyCode);
        res.status(200).json(result(0, 'success', districts));
    } catch (error) {
        res.status(400).json(result(1, 'failed', { message: error.message }));
    }
};

exports.getVillages = async (req, res) => {
    try {
        const villages = await geolocationService.getVillagesByDistrict(req.params.districtCode);
        res.status(200).json(result(0, 'success', villages));
    } catch (error) {
        res.status(400).json(result(1, 'failed', { message: error.message }));
    }
};
