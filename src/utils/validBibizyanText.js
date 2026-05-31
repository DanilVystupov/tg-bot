import {
  ENG_LETTERS_REGEX,
  MAX_MESSAGE_LENGTH,
  MIN_MESSAGE_LENGTH,
} from '../constants/bibizyan.js';

export const validBibizyanText = (message) => {
  const hasEnglishLetters = ENG_LETTERS_REGEX.test(message);

  return !(
    !message.includes('Сегодня ты:') ||
    message.length < MIN_MESSAGE_LENGTH ||
    message.length > MAX_MESSAGE_LENGTH ||
    hasEnglishLetters
  );
};
