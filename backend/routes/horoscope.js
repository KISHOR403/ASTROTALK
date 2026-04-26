const express = require('express');
const path = require('path');
const fs = require('fs/promises');

const router = express.Router();

const VALID_PERIODS = new Set(['daily', 'weekly', 'monthly']);

router.get('/:period', async (req, res) => {
  try {
    const { period } = req.params;
    if (!VALID_PERIODS.has(period)) {
      return res.status(404).json({ message: 'Invalid period' });
    }

    const filePath = path.join(
      __dirname,
      '..',
      '..',
      'python_service',
      'horoscope_data',
      `${period}_latest.json`
    );

    try {
      const raw = await fs.readFile(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      return res.json(parsed);
    } catch (err) {
      if (err && (err.code === 'ENOENT' || err.code === 'ENOTDIR')) {
        return res.status(404).json({ message: 'Horoscope data not found' });
      }
      throw err;
    }
  } catch (error) {
    console.error('Horoscope route error:', error);
    return res.status(500).json({ message: 'Failed to load horoscope data' });
  }
});

module.exports = router;

