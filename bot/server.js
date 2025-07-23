const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const multer = require('multer');

const app = express();
const upload = multer(); // for handling multipart/form-data

// 🔐 Your actual bot token
const token = '7842203083:AAEyRUVo_zaT2nhgdN4VZ7TwQLlsiGjRAjI';

// 🔄 Enable polling so bot stays live
const bot = new TelegramBot(token, { polling: true });

// ✅ Test command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '👋 Hello! LuxFlix Bot is now live and working ✅');
});

// 🌐 Basic endpoint so Replit knows the server is alive
app.get('/', (req, res) => {
  res.send('✅ LuxFlix Bot is running...');
});

// ✅ Replit needs this to keep the process alive
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
