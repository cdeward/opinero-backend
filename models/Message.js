const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create a new message record
async function createMessage(businessId, customerId, messageType, status) {
  const result = await pool.query(
    `INSERT INTO messages (business_id, customer_id, message_type, status)
     VALUES ($1, $2, $3, $4)
     RETURNING id, business_id, customer_id, message_type, status, sent_at`,
    [businessId, customerId, messageType, status]
  );

  return result.rows[0];
}

// Update message status after sending
async function updateMessageStatus(messageId, status) {
  const result = await pool.query(
    `UPDATE messages
     SET status = $1, sent_at = NOW()
     WHERE id = $2
     RETURNING id, status, sent_at`,
    [status, messageId]
  );

  return result.rows[0];
}

// Find pending messages that need sending
async function findPendingMessages() {
  const result = await pool.query(
    `SELECT messages.id AS message_id, customers.*, messages.message_type
     FROM messages
     JOIN customers ON messages.customer_id = customers.id
     WHERE messages.status = 'pending'
     ORDER BY customers.visit_date ASC`
  );

  return result.rows;
}

module.exports = {
  createMessage,
  updateMessageStatus,
  findPendingMessages,
};
