const { updateUserSettings } = require('../models/User');

async function saveSettings(req, res) {
  const businessId = req.user.id;
  const { whatsappKey, emailKey, messageDelay, templateText } = req.body;

  try {
    await updateUserSettings(businessId, whatsappKey, emailKey, messageDelay, templateText);
    res.status(200).json({ message: 'Settings saved successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error saving settings.' });
  }
}
async function fetchSettings() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:5000/api/settings/fetch', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { whatsapp_key, email_key, message_delay, template_text } = response.data;

    setWhatsappKey(whatsapp_key || '');
    setEmailKey(email_key || '');
    setMessageDelay(message_delay || '');
    setTemplateText(template_text || '');
  } catch (error) {
    console.error('Error fetching settings:', error);
    // You can also optionally alert the user
  }
}

module.exports = {
  saveSettings,
  fetchSettings,
};
