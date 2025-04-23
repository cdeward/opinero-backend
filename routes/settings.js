const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const { saveSettings, fetchSettings } = require('../controllers/settingsController');

// Save user settings
router.post('/save', authenticateToken, saveSettings); // ✅ using correct function name

router.get('/fetch', authenticateToken, fetchSettings);

module.exports = router;

