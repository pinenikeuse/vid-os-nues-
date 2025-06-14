require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(express.json());

// Sert les fichiers statiques (HTML) depuis "public"
app.use(express.static(path.join(__dirname, 'public')));

// Route principale pour / (accueil)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Configuration Telegram
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendTelegramMessage(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  await axios.post(url, {
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
  });
}

// Route pour envoyer une notif via Telegram
app.post('/send-notification', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).send('Message manquant.');

  await sendTelegramMessage(message);
  res.send('Notification envoyée sur Telegram.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
