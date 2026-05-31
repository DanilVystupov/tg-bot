import express from 'express';
import dotenv from 'dotenv';
import { bot } from './bot.js';
import { getUserByUserName } from './db/users.js';

dotenv.config();

const PORT = process.env.PORT;
const WEBHOOK_DOMAIN = process.env.WEBHOOK_DOMAIN;
const NODE_ENV = process.env.NODE_ENV;
const TEST_USER_NAME = process.env.TEST_USER_NAME;

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

app.get('/daily', async (req, res) => {
  try {
    const user = await getUserByUserName(TEST_USER_NAME);

    if (!user) {
      throw new Error('Пользователь не найден');
    }

    try {
      await bot.telegram.sendMessage(user.telegram_id, 'Тестовая рассылка');

      // Защита от флуд лимита
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      if (error.response?.error_code === 403) {
        console.log('Пользователь заблокировал бота');
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Произошла ошибка с ежедневной рассылкой: ', error.message);
    res.status(500).send('ERROR');
  }
});

process.once('SIGINT', () => {
  bot.stop('SIGINT');
  process.exit();
});

process.once('SIGTERM', () => {
  bot.stop('SIGTERM');
  process.exit();
});
