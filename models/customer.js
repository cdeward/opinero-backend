const { Pool } = require('pg');

// PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create a new customer
async function createCustomer(businessId, name, email, phone, visitDate) {
  const result = await pool.query(
    `INSERT INTO customers (business_id, name, email, phone, visit_date)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, phone, visit_date`,
    [businessId, name, email, phone, visitDate]
  );

  return result.rows[0];
}

// (Later we'll add uploadCustomers for CSV import.)

module.exports = {
  createCustomer,
};
