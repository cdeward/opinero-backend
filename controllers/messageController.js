const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Controller: Get Message History
async function getMessageHistory(req, res) {
  const { userId } = req.user;

  try {
    const result = await pool.query(
      `SELECT messages.id, customers.name, customers.email, customers.phone, messages.message_type, messages.status, messages.sent_at
       FROM messages
       JOIN customers ON messages.customer_id = customers.id
       WHERE messages.business_id = $1
       ORDER BY messages.sent_at DESC`,
      [userId]
    );

    res.json({ messages: result.rows });
  } catch (error) {
    console.error('Error fetching message history:', error);
    res.status(500).json({ message: 'Server error while fetching message history.' });
  }
}

module.exports = {
  getMessageHistory,
};
