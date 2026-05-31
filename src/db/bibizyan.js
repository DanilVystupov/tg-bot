import axios from 'axios';
import dotenv from 'dotenv';
import { supabase } from './index.js';
import { validBibizyanText } from '../utils/validBibizyanText.js';

dotenv.config();

const TENOR_API_KEY = process.env.TENOR_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function getRandomBibizyanGif() {
  try {
    const { data } = await axios.get('https://tenor.googleapis.com/v2/search', {
      params: {
        key: TENOR_API_KEY,
        q: 'monkey',
        limit: 1,
        random: true,
        media_filter: 'tinygif',
      },
      timeout: 5000,
    });

    return data.results;
  } catch (error) {
    console.error('Ошибка при получении URL гифки: ', error.message);
  }
}

export async function generateBibizyanTextFromAI(gifUrl, gifDescription) {
  try {
    const prompt = `
      Ты — автор абсурдных интернет-мемов с черным юмором и самоиронией.
      
      Задача: придумать СМЕШНОЕ, неожиданное описание гифки.
      Url гифки: ${gifUrl}
      Короткое описаине гифки: ${gifDescription} 
      
      ВАЖНО:
      - Юмор должен быть НЕ очевидный, с поворотом или абсурдом
      - Избегай банальных шуток и повторения примеров
      - Лучше странно, чем скучно
      
      ФОРМАТ СТРОГО:
      Сегодня ты: **Бибизян-тип** — описание эмодзи
      
      ПРАВИЛА:
      - тип = 1 короткое слово
      - описание = 5–9 слов
      - в конце 1–2 эмодзи
      - максимум 90 символов
      
      СТИЛЬ ЮМОРА:
      - абсурд ("план был, но он испугался")
      - самоирония ("делаю вид, что понимаю жизнь")
      - гипербола ("устал так, что стал мебелью")
      - неожиданный поворот
      
      ПЛОХО:
      "устал после работы 😴" (слишком просто)
      
      ХОРОШО:
      "Сегодня ты: **Бибизян-зумер** — работаешь 5 минут, устал на 5 часов 📱",
      "Сегодня ты: **Бибизян-доставка** — ждешь пиццу 2 часа, но забыл заказать 🍕⏳",
      "Сегодня ты: **Бибизян-инфлюенсер** — продал душу за 5 лайков (не окупилось) 😇❤️",
      
      НЕ ИСПОЛЬЗУЙ шаблоны из примеров.
      
      Ответ только одной строкой.
    `;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openrouter/free',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        reasoning: { enabled: true },
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = response.data.choices[0].message.content
      .replace(/<think>.*<\/think>/gs, '')
      .replace(/<assistant>.*<\/assistant>/gs, '')
      .replace(/^[^а-яА-Я]*/, '')
      .trim();

    const isValid = validBibizyanText(result);

    if (!isValid) {
      throw new Error(`Формат нарушен: ${result}`);
    }

    return result;
  } catch (error) {
    console.error(
      'Ошибка при генерации описания для гифки с бибизяном:',
      error.message
    );
    return await getRandomBibizyanTextFromDB();
  }
}

async function getRandomBibizyanTextFromDB() {
  const { data, error } = await supabase
    .from('random_bibizyan')
    .select('text')
    .limit(1)
    .single();

  if (error) {
    console.error(
      'Ошибка при получении описания из БД для гифки с бибизяном: ',
      error.message
    );
    throw error;
  }

  return data.text;
}
