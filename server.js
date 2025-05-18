require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// Sert ton formulaire HTML et tout ce qui est dans /public
app.use(express.static('public'));

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendTelegramMessage(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
    });
    console.log("✅ Message envoyé à Telegram :", message);
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi du message Telegram :", error.message);
  }
}

app.post('/send-notification', async (req, res) => {
  console.log('✅ Requête reçue:', req.body);
  const { message } = req.body;
  if (!message) return res.status(400).send('❌ Message manquant.');

  await sendTelegramMessage(message);
  res.send('✅ Notification envoyée sur Telegram.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Serveur démarré sur le port ${PORT}`));
