const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware'); // ✅ CORRECT now
const { getMetrics } = require('../controllers/dashboardController'); // ✅

router.get('/metrics', authenticateToken, getMetrics); // ✅

module.exports = router;
