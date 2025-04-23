const { findPendingMessages, updateMessageStatus } = require('../models/Message');
const axios = require('axios');
require('dotenv').config(); // Load .env

// Your WhatsApp Cloud API Credentials
const WHATSAPP_TOKEN = 'EAATFjaTYusoBOZCheS7wtUOmGzjG2o1PmUJFT1BZCvDj3BXDZBMGc38GnNjUX2Fo3Yjz9qTa327uO4Bnlgs7D3C4XBkqZAQBqygn3AOyOlgoWxcRcY1NXBWZA63SAmXR6osjV81dshX4zFd30Xwu0P7DvVe3ybZA81POkZAtoszgrsdy2jtSp6eDN9TByOZC2MSSXGN06aCgao9OM7pYaW2Vkmwbb78ZD';
const WHATSAPP_PHONE_NUMBER_ID = '600707763133218'; // YOUR PHONE NUMBER ID

// Real WhatsApp sending function
async function sendWhatsAppMessage(customer) {
  console.log(`📤 Sending WhatsApp to ${customer.phone}: Hi ${customer.name}, please leave us a review on Google! ⭐`);

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: customer.phone, // must be E.164 format, like 15556402722
        type: 'template',
        template: {
          name: 'review_request', // your template name registered
          language: { code: 'en_US' },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: customer.name }, // fills {{name}}
              ],
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ WhatsApp API Response:', response.data);
    return true;
  } catch (error) {
    console.error('❌ WhatsApp API Error:', error.response?.data || error.message);
    return false;
  }
}

// Simulated Email sending function
async function sendEmail(customer) {
  console.log(`📧 Sending Email to ${customer.email}: Hi ${customer.name}, please leave us a review on Google! ⭐`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return true;
}

// Main engine to process pending messages
async function processPendingMessages() {
  console.log('🔄 Checking for pending messages...');

  const pendingMessages = await findPendingMessages();
  console.log('🔎 Pending Messages Found:', pendingMessages);

  if (!pendingMessages || pendingMessages.length === 0) {
    console.log('✅ No pending messages to send.');
    return;
  }

  for (const msg of pendingMessages) {
    try {
      let success = false;

      if (msg.message_type === 'whatsapp') {
        success = await sendWhatsAppMessage(msg);
      } else if (msg.message_type === 'email') {
        success = await sendEmail(msg);
      } else {
        console.warn(`⚠️ Unknown message type for message ID ${msg.message_id}: ${msg.message_type}`);
        await updateMessageStatus(msg.message_id, 'failed');
        continue;
      }

      if (success) {
        await updateMessageStatus(msg.message_id, 'sent');
        console.log(`✅ Message ID ${msg.message_id} sent successfully.`);
      } else {
        await updateMessageStatus(msg.message_id, 'failed');
        console.log(`❌ Message ID ${msg.message_id} failed to send.`);
      }
    } catch (error) {
      console.error(`❌ Error processing message ID ${msg.message_id}:`, error);
      await updateMessageStatus(msg.message_id, 'failed');
    }
  }
}

module.exports = {
  processPendingMessages,
};
