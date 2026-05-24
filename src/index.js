import express from 'express';
import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;

const bot = new Telegraf(TOKEN);

bot.start((ctx) => {
  ctx.reply('Привет! Я твой бот 🤖');
});

bot.command('hello', (ctx) => {
  ctx.reply('Hello!🚀');
});

bot.launch({
  webhook: {
    domain: '',
    port: PORT,
  },
});

const app = express();

app.get('/', (req, res) => {
  res.send('Bot is running 🚀');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
