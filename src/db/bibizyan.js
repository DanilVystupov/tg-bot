import axios from 'axios';
import dotenv from 'dotenv';
import { supabase } from './index.js';

dotenv.config();

const TENOR_API_KEY = process.env.TENOR_API_KEY;

export async function getRandomBibizyanText() {
  const { data } = await supabase
    .from('random_bibizyan')
    .select('text')
    .limit(1)
    .single();

  return data.text;
}

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
