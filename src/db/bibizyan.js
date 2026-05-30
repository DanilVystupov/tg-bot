import axios from 'axios';
import dotenv from 'dotenv';
import { supabase } from './index.js';

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

export async function getRandomBibizyanTextFromAI(gifUrl) {
  const strictPrompt = `
      ОТВЕТЬ ОДНИМ СООБЩЕНИЕМ БЕЗ РАССУЖДЕНИЙ.
      Придумай смешное описание меменой/смешной гифки по url: ${gifUrl}.

      В следющем формате:
      Сегодня ты: **Бибизян-тип** — описание эмодзи
        Где: 
        - тип=1 русское слово
        - описание=6-8 русских слов
        - 1 эмодзи в конце

      Примеры:
      "Сегодня ты: **Бибизян-соня** — уже пятый раз пересматриваешь эту гифку 💤",
      "Сегодня ты: **Бубнезный бибизян** — несешь чушь, но звучит эпично 🎤", 
      "Сегодня ты: **Бибизян-зумер** — работаешь 5 минут, устал на 5 часов 📱",
      "Сегодня ты: **Бибизян-ностальгия** — 'раньше бананы были вкуснее...' 🍌🕰️",  
      "Сегодня ты: **Бибизян-сарказм** — 'о, отлично... просто замечательно' 👏",  
      "Сегодня ты: **Бибизян-детокс** — 'сегодня без кринжа... (шутка)' 🧘",  
      "Сегодня ты: **Бибизян-хаос** — 'у меня есть план... НЕТ' 🎭", 

      ПРИМЕРЫ НЕ ИСПОЛЬЗУЙ В ФИНАЛЬНОМ ОТВЕТЕ.

      Темы могут быть абсолютно разными:
        - Состояния усталости
        - Работа/учеба
        - Эмоции/настроение
        - Ситуативные
        - Абсурдные
        - Интернет/мемы
        - Бытовуха
      ОТВЕТЬ ОДНИМ СООБЩЕНИЕМ БЕЗ РАССУЖДЕНИЙ.
      ОТВЕТ МАКСИМУМ 80 СИМВОЛОВ!
    `;

  let response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'openrouter/free',
      messages: [
        {
          role: 'user',
          content: strictPrompt,
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

  const result = await response.data;
  return result.choices[0].message.content;
}

export async function getRandomBibizyanText() {
  const { data } = await supabase
    .from('random_bibizyan')
    .select('text')
    .limit(1)
    .single();

  return data.text;
}
