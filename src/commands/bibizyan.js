import {
  getRandomBibizyanGif,
  getRandomBibizyanTextFromAI,
} from '../db/bibizyan.js';

export const bibizyanCommand = (bot) => {
  let isLoading = false;

  bot.command('bibizyan', async (ctx) => {
    if (isLoading) {
      return;
    }

    ctx.reply('Определяю кто ты сегодня...');

    try {
      isLoading = true;

      let bibizyanGif;
      let bibizyanText;

      const responseBibizyanGif = await getRandomBibizyanGif();
      bibizyanGif = responseBibizyanGif[0].media_formats.tinygif.url;

      bibizyanText = await getRandomBibizyanTextFromAI(bibizyanGif);

      ctx.replyWithAnimation(bibizyanGif, {
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
