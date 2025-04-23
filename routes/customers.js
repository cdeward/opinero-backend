const express = require('express');
const router = express.Router();
const { addCustomer, uploadCustomers, listCustomers } = require('../controllers/customerController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

// Add manual customer
router.post('/add', authenticateToken, addCustomer);

// Upload CSV customers
router.post('/upload', authenticateToken, uploadMiddleware.single('file'), uploadCustomers);

router.get('/list', authenticateToken, listCustomers);


module.exports = router;
