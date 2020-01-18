import {getRandomNumber} from '../utils/utils.js';
import {getObjectsArray} from '../utils/utils.js';

export const PEOPLE_NAMES = [`Rachel Matthews`, `Alan Tudyk`, `Hadley Gannaway`, `Kristen Bell`, `Frank Darabont`, `Stephen King`, `Tim Robbins`, `Morgan Freeman`, `Bob Gunton`, `Tom Hanks`, `Robin Wright`, `Gary Sinise`];
import {EmojiType} from '../const.js';
const emoji = Object.keys(EmojiType);
const COMMENTS_TEXT = [`Interesting setting and a good cast`, `Booooooooooring`, `Very very old. Meh`, `Almost two hours? Seriously?`];

export const generateDateComment = () => {
  let date = new Date();
  return date;
};

export const getDateComment = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const number = date.getDate();
  const hours = date.getHours();
  const minute = date.getMinutes();
  return `${year}/${month}/${number} ${hours}:${minute}`;
};

const generateMovieComment = () => {
  return {
    id: String(new Date().valueOf() + Math.random()),
    emoji: emoji[getRandomNumber(emoji.length)],
    textComment: COMMENTS_TEXT[getRandomNumber(COMMENTS_TEXT.length)],
    autorComment: PEOPLE_NAMES[getRandomNumber(PEOPLE_NAMES.length)],
    dateComment: getDateComment(generateDateComment()),
  };
};

export const generateComments = () => {
  return getObjectsArray(generateMovieComment, getRandomNumber(10));
};
