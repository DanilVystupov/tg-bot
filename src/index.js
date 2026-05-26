import express from 'express';
import dotenv from 'dotenv';
import { bot } from './bot.js';

dotenv.config();

const PORT = process.env.PORT;
const WEBHOOK_DOMAIN = process.env.WEBHOOK_DOMAIN;
const NODE_ENV = process.env.NODE_ENV;

const app = express();

app.use(express.json());

if (NODE_ENV === 'production') {
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
} else {
  bot.launch();
}

process.once('SIGINT', () => {
  bot.stop('SIGINT');
  process.exit();
});

process.once('SIGTERM', () => {
  bot.stop('SIGTERM');
  process.exit();
});
