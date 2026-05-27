import dotenv from 'dotenv';
import { Telegraf } from 'telegraf';
import { startCommand } from './commands/start.js';
import { bibizyanCommand } from './commands/bibizyan.js';

dotenv.config();

const TOKEN = process.env.BOT_TOKEN;

export const bot = new Telegraf(TOKEN);

startCommand(bot);
bibizyanCommand(bot);
