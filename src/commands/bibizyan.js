import { getRandomBibizyanGif, getRandomBibizyanText } from '../db/bibizyan.js';

export const bibizyanCommand = (bot) => {
  let isLoading = false;

  bot.command('bibizyan', async (ctx) => {
    if (isLoading) {
      return;
    }

    try {
      isLoading = true;

      let bibizyanText;
      let bibizyanGif;

      const requests = [
        await getRandomBibizyanText(),
        await getRandomBibizyanGif(),
      ];

      const result = await Promise.allSettled(requests);

      if (result[0].status === 'fulfilled') {
        bibizyanText = result[0].value;
      } else {
        throw new Error();
      }

      if (result[1].status === 'fulfilled') {
        bibizyanGif = result[1].value;
      } else {
        throw new Error();
      }

      ctx.replyWithAnimation(bibizyanGif[0].media_formats.tinygif.url, {
        caption: bibizyanText,
      });
    } catch (error) {
      console.error('Произошла ошибка при /bibizyan', error.message);
      ctx.reply('Произошла ошибка. Попробуйте еще раз /bibizyan');
    } finally {
      isLoading = false;
    }
  });
};
