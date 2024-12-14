const express = require('express');
const geolocationController = require('../controllers/geolocationController');

const router = express.Router();

router.get('/provinces', geolocationController.getProvinces);
router.get('/regencies/:provinceCode', geolocationController.getRegencies);
router.get('/districts/:regencyCode', geolocationController.getDistricts);
router.get('/villages/:districtCode', geolocationController.getVillages);

module.exports = router;
