const axios = require('axios');

const BASE_URL = 'https://wilayah.id/api';

exports.getAllProvinces = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/provinces.json`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch provinces');
    }
};

exports.getRegenciesByProvince = async (provinceCode) => {
    if (!provinceCode) throw new Error('Province code is required');
    try {
        const response = await axios.get(`${BASE_URL}/regencies/${provinceCode}.json`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch regencies');
    }
};

exports.getDistrictsByRegency = async (regencyCode) => {
    if (!regencyCode) throw new Error('Regency code is required');
    try {
        const response = await axios.get(`${BASE_URL}/districts/${regencyCode}.json`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch districts');
    }
};

exports.getVillagesByDistrict = async (districtCode) => {
    if (!districtCode) throw new Error('District code is required');
    try {
        const response = await axios.get(`${BASE_URL}/villages/${districtCode}.json`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch villages');
    }
};
