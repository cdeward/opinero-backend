const cron = require('node-cron');
const { processPendingMessages } = require('../services/messageSender');

// Schedule to run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  console.log('⏰ Cron Job Triggered: Checking for pending messages...');
  await processPendingMessages();
});

console.log('✅ Message Scheduler is running...');
