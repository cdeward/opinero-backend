const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function getMetrics(req, res) {
  const businessId = req.user.userId;

  try {
    const clientCountResult = await pool.query(
      'SELECT COUNT(*) FROM customers WHERE business_id = $1',
      [businessId]
    );

    const clientsAdded = parseInt(clientCountResult.rows[0].count, 10);

    res.json({
      clientsAdded,
      messagesSent: 0,
      reviewsReceived: 0,
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ message: 'Server error while fetching metrics.' });
  }
}

module.exports = {
  getMetrics,
};
