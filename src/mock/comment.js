import {getRandomNumber} from '../utils.js';
import {getObjectsArray} from '../utils.js';

const PEOPLE_NAMES = [`Rachel Matthews`, `Alan Tudyk`, `Hadley Gannaway`, `Kristen Bell`, `Frank Darabont`, `Stephen King`, `Tim Robbins`, `Morgan Freeman`, `Bob Gunton`, `Tom Hanks`, `Robin Wright`, `Gary Sinise`];
const SRC_EMOJI = [`angry.png`, `puke.png`, `sleeping.png`, `smile.png`, `trophy.png`];
const COMMENTS_TEXT = [`Interesting setting and a good cast`, `Booooooooooring`, `Very very old. Meh`, `Almost two hours? Seriously?`];

const generateDateComment = () => {
  let date = new Date();
  return date;
};

const getDateComment = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const number = date.getDate();
  const hours = date.getHours();
  const minute = date.getMinutes();
  return `${year}/${month}/${number} ${hours}:${minute}`;
};

const generateMovieComment = () => {
  return {
    emoji: SRC_EMOJI[getRandomNumber(SRC_EMOJI.length)],
    textComment: COMMENTS_TEXT[getRandomNumber(COMMENTS_TEXT.length)],
    autorComment: PEOPLE_NAMES[getRandomNumber(PEOPLE_NAMES.length)],
    dateComment: getDateComment(generateDateComment()),
  };
};

export const generateMovieComments = (count) => {
  return getObjectsArray(generateMovieComment, count);
};


