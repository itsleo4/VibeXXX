const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// 🔐 Bot token + Chat ID
const token = '7842203083:AAEyRUVo_zaT2nhgdN4VZ7TwQLlsiGjRAjI';
const chatId = '6880300714'; // ← Replace this with your own ID

const app = express();
app.use(cors());
app.use(express.json());

// 🟡 Setup multer to accept file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// 🤖 Init Telegram Bot with polling
const bot = new TelegramBot(token, { polling: true });

// 🟢 Telegram test command
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, '👋 Hello! LuxFlix Bot is now live and working ✅');
});

// 🌐 Root test for Replit
app.get('/', (req, res) => {
  res.send('✅ LuxFlix Bot is running...');
});

// 📤 Submit proof route
app.post('/submit', upload.single('screenshot'), async (req, res) => {
  const { name, refID } = req.body;
  const file = req.file;

  if (!name || !refID || !file) {
    return res.status(400).send('❌ Missing name, refID, or screenshot');
  }

  const caption = `💸 New Pro Request:\n\n👤 Name: ${name}\n📧 Ref: ${refID}`;

  try {
    await bot.sendPhoto(chatId, fs.createReadStream(file.path), {
      caption: caption,
    });

    fs.unlinkSync(file.path); // Optional: delete file after sending
    res.status(200).send('✅ Payment proof submitted');
  } catch (err) {
    console.error('❌ Error sending to Telegram:', err.message);
    res.status(500).send('❌ Error submitting. Please try later.');
  }
});

// ✅ Keep Replit server alive
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
