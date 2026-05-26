import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function findUserById(id) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('telegram_id', id)
    .maybeSingle();

  if (error) {
    console.error('Ошибка при поиске пользователя: ', error.message);
    throw error;
  }

  return data;
}

export async function addUser(user) {
  const { error } = await supabase.from('users').insert([
    {
      telegram_id: user.id,
      username: user.username,
      language_code: user.language_code,
      first_name: user.first_name,
    },
  ]);

  if (error) {
    console.error('Ошибка при добавлении пользователя: ', error.message);
    throw error;
  }
}
