import {getRandomNumber} from '../utils/utils.js';
import {getObjectsArray} from '../utils/utils.js';

export const PEOPLE_NAMES = [`Rachel Matthews`, `Alan Tudyk`, `Hadley Gannaway`, `Kristen Bell`, `Frank Darabont`, `Stephen King`, `Tim Robbins`, `Morgan Freeman`, `Bob Gunton`, `Tom Hanks`, `Robin Wright`, `Gary Sinise`];
import {EmojiType} from '../const.js';
const emoji = Object.values(EmojiType);
const COMMENTS_TEXT = [`Interesting setting and a good cast`, `Booooooooooring`, `Very very old. Meh`, `Almost two hours? Seriously?`];



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
