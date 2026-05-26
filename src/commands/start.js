import { findUserById, addUser } from '../db/users.js';

export const startCommand = (bot) => {
  bot.start(async (ctx) => {
    const user = ctx.from;

    try {
      const isExistingUser = await findUserById(user.id);

      if (isExistingUser) {
        ctx.reply('Ты уже падпищик!!!');
        return;
      }

      await addUser(user);
      await ctx.reply('Привет падпищик!!!');
    } catch (error) {
      console.error('Произошла ошибка при /start: ', error.message);
      ctx.reply('Произошла ошибка. Попробуйте еще раз /start');
    }
  });
};
