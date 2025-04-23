const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const { processPendingMessages } = require('../services/messageSender');
const { getMessageHistory } = require('../controllers/messageController');

// Route to trigger manual sending
router.post('/send', authenticateToken, async (req, res) => {
  try {
    await processPendingMessages();
    res.json({ message: '✅ Message processing triggered successfully.' });
  } catch (error) {
    console.error('Error processing messages:', error);
    res.status(500).json({ message: '❌ Server error while sending messages.' });
  }
});

// NEW: Route to fetch message history
router.get('/history', authenticateToken, getMessageHistory);

module.exports = router;
