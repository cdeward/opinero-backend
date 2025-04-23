const { Pool } = require('pg');
const bcrypt = require('bcrypt');

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// -----------------------
// User model functions
// -----------------------

// Create a new user (signup)
async function createUser(businessName, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    'INSERT INTO users (business_name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, business_name, email',
    [businessName, email, hashedPassword]
  );

  return result.rows[0];
}

// Find user by email (login)
async function findUserByEmail(email) {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  return result.rows[0];
}

// Update user settings (WhatsApp, Email API keys etc.)
async function updateUserSettings(id, whatsappKey, emailKey, messageDelay, templateText) {
  await pool.query(
    `UPDATE users 
     SET whatsapp_key = $1, email_key = $2, message_delay = $3, template_text = $4
     WHERE id = $5`,
    [whatsappKey, emailKey, messageDelay, templateText, id]
  );
}

// -----------------------
// Export all functions
// -----------------------
module.exports = {
  createUser,
  findUserByEmail,
  updateUserSettings,
};
