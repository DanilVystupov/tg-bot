import express from 'express';
import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT;
const WEBHOOK_DOMAIN = process.env.WEBHOOK_DOMAIN;

const bot = new Telegraf(TOKEN);

bot.start((ctx) => {
  ctx.reply('Привет! Я твой бот 🤖');
});

bot.command('hello', (ctx) => {
  ctx.reply('Hello!🚀');
});

const app = express();

app.use(express.json());

app.post('/webhook', (req, res) => {
  bot.handleUpdate(req.body, res);
});

app.get('/', (req, res) => res.send('Bot is running'));

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  const webhookUrl = `${WEBHOOK_DOMAIN}/webhook`;
  await bot.telegram.setWebhook(webhookUrl);
  console.log(`Webhook set to ${webhookUrl}`);
});

process.once('SIGINT', () => {
  bot.stop('SIGINT');
  process.exit();
});

process.once('SIGTERM', () => {
  bot.stop('SIGTERM');
  process.exit();
});
