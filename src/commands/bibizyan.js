import {
  getRandomBibizyanGif,
  generateBibizyanTextFromAI,
} from '../db/bibizyan.js';
import { MAX_GIF_SIZE } from '../constants/bibizyan.js';

export const bibizyanCommand = (bot) => {
  let isLoading = false;

  bot.command('bibizyan', async (ctx) => {
    if (isLoading) {
      return;
    }

    ctx.reply('Определяю кто ты сегодня...');

    try {
      isLoading = true;

      const responseBibizyanGif = await getRandomBibizyanGif();

      const contentLength = responseBibizyanGif[0].media_formats.tinygif.size;
      if (contentLength && contentLength > MAX_GIF_SIZE) {
        throw new Error(`GIF слишком большой: ${contentLength} байт`);
      }

      const bibizyanGif = responseBibizyanGif[0].media_formats.tinygif.url;
      const bibizyanContentDescription =
        responseBibizyanGif[0].content_description;
      const bibizyanText = await generateBibizyanTextFromAI(
        bibizyanGif,
        bibizyanContentDescription
      );

      ctx.replyWithAnimation(bibizyanGif, {
        caption: bibizyanText,
      });
    } catch (error) {
      console.error('Произошла ошибка при /bibizyan: ', error.message);
      ctx.reply('Произошла ошибка. Попробуйте еще раз /bibizyan');
    } finally {
      isLoading = false;
    }
  });
};
