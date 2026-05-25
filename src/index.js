import express from 'express';
import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT;
const WEBHOOK_DOMAIN = process.env.WEBHOOK_DOMAIN;
const NODE_ENV = process.env.NODE_ENV;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const bot = new Telegraf(TOKEN);

bot.start(async (ctx) => {
  const user = ctx.from;

  const userPayload = {
    telegram_id: user.id,
    username: user.username,
    language_code: user.language_code,
    first_name: user.first_name,
  };

  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('telegram_id', user.id)
    .single();

  if (existingUser) {
    ctx.reply('Ты уже падпищик!!!');
    return;
  }

  const { error: insertError } = await supabase
    .from('users')
    .insert([userPayload]);

  if (insertError) {
    console.error('Ошибка при добавлении пользователя: ', insertError);
    ctx.reply('Ошибка. Попробуйте еще раз запустить команду /start');
    return;
  }

  ctx.reply('Привет падпищик!!!');
});

bot.command('hello', (ctx) => {
  ctx.reply('Hello!🚀');
});

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
