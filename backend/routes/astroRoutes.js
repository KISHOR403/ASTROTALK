const express = require('express');
const router = express.Router();
const { getHoroscope, getCompatibility, getBirthChart } = require('../controllers/astroController');

router.get('/horoscope/:sign', getHoroscope);
router.post('/compatibility', getCompatibility);
router.post('/birth-chart', getBirthChart);

module.exports = router;
