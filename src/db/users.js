import { supabase } from './index.js';

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

export async function getUserByUserName(username) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .maybeSingle();

  if (error) {
    console.error(
      'Ошибка при получении пользователя по username: ',
      error.message
    );
    throw error;
  }

  return data;
}
