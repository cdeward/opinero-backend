const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use((req, res, next) => {
  console.log('Request hit:', req.method, req.url);
  next();
});

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const messageRoutes = require('./routes/messages');
app.use('/api/messages', messageRoutes);

const customerRoutes = require('./routes/customers');
app.use('/api/customers', customerRoutes);

const dashboardRoutes = require('./routes/dashboard');
app.use('/api/dashboard', dashboardRoutes);

const settingsRoutes = require('./routes/settings');
app.use('/api/settings', settingsRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('Opinero Backend is Running!');
});

require('./jobs/messageScheduler'); // 🔥 Start the Cron Job

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
