const { Pool } = require('pg');
const { createCustomer } = require('../models/Customer');
const fs = require('fs');
const csv = require('csv-parse');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


// Controller to handle adding a single customer
async function addCustomer(req, res) {
  console.log('🔍 Debug req.user:', req.user); // 🔥 Added to check token payload

  const { name, email, phone, visitDate } = req.body;
  const businessId = req.user.userId; // From authMiddleware

  if (!name || !email || !phone || !visitDate) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const newCustomer = await createCustomer(businessId, name, email, phone, visitDate);
    res.status(201).json({ message: 'Customer added successfully.', customer: newCustomer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while adding customer.' });
  }
}

// Controller to handle uploading customers from CSV
async function uploadCustomers(req, res) {
  const businessId = req.user.userId;
  const filePath = req.file.path;

  const customers = [];

  try {
    const parser = fs.createReadStream(filePath).pipe(csv.parse({ columns: true }));

    for await (const record of parser) {
      const { name, email, phone, visitDate } = record;

      if (!name || !email || !phone || !visitDate) {
        continue; // Skip incomplete records
      }

      customers.push({ name, email, phone, visitDate });
    }

    for (const customer of customers) {
      await createCustomer(
        businessId,
        customer.name,
        customer.email,
        customer.phone,
        customer.visitDate
      );
    }

    // Clean up file after processing
    fs.unlinkSync(filePath);

    res.status(201).json({ message: `${customers.length} customers uploaded successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while uploading customers.' });
  }
}

// Controller to list all customers for a business
async function listCustomers(req, res) {
  const { userId } = req.user;

  try {
    const result = await pool.query(
      'SELECT id, name, email, phone, visit_date FROM customers WHERE business_id = $1 ORDER BY visit_date DESC',
      [userId]
    );

    res.json({ customers: result.rows });
  } catch (error) {
    console.error('Error listing customers:', error);
    res.status(500).json({ message: 'Server error while listing customers.' });
  }
}

module.exports = {
  createCustomer,
  addCustomer,
  uploadCustomers,
  listCustomers,
};
