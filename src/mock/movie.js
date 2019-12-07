import {getRandomNumber} from '../utils.js';
import {getRandomRange} from '../utils.js';
import {generateRandomArray} from '../utils.js';
import {MONTHS} from '../const.js';

const MOVIE_TITLES = [`Frozen II`, `The Shawshank Redemption`, `Forrest Gump`, `The Matrix`, `The Matrix`, `The Lord of the Rings: The Fellowship of the Ring`, `Pulp Fiction`, `The Silence of the Lambs`, `Saving Private Ryan`, `Gladiator`, `Se7en`];
const COUNTRIES = [`Russia`, `USA`, `Spain`, `UC`, `Japan`, `Finland`, `Israel`, `Poland`, `Thailand`, `Turkey`];
const PEOPLE_NAMES = [`Rachel Matthews`, `Alan Tudyk`, `Hadley Gannaway`, `Kristen Bell`, `Frank Darabont`, `Stephen King`, `Tim Robbins`, `Morgan Freeman`, `Bob Gunton`, `Tom Hanks`, `Robin Wright`, `Gary Sinise`];
const GENRES = [`Horror`, `Adventure`, `Action`, `Sci-Fi`, `Drama`, `Fantasy`, `Romance`, `Western`, `Crime`, `Thriller`];
const DESCRIPTION_TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
const AGE_LIMITS = [`0+`, `6+`, `12+`, `18+`];
const SRC_IMAGES = [`made-for-each-other.png`, `popeye-meets-sinbad.png`, `sagebrush-trail.jpg`, `santa-claus-conquers-the-martians.jpg`, `the-dance-of-life.jpg`, `the-great-flamarion.jpg`, `the-man-with-the-golden-arm.jpg`];

const getDescriptions = (text) => {
  let array = [];
  let start = 0;
  let end = -1;
  while ((end = text.indexOf(`.`, end + 2)) !== -1) {
    array.push(text.slice(start, end + 1));
    start = end + 2;
  }
  return array;
};

const getText = (array, character) => {
  let str = ``;
  for (const item of array) {
    str = `${str}${item}${character}`;
  }
  return str.trim();
};

const deleteLastItem = (str) => {
  return str.slice(0, -1);
};

const generateRunTime = () => {
  let date = new Date();
  date.setHours(getRandomRange(0, 4));
  date.setMinutes(getRandomRange(0, 60));
  const hours = date.getHours() < 1 ? `` : `${date.getHours()}h`;
  const minute = date.getMinutes();
  return `${hours} ${minute}min`;
};

const generateDateRelease = () => {
  let date = new Date();
  date.setFullYear(getRandomRange(1920, date.getFullYear()), getRandomNumber(12), getRandomNumber(31));
  const year = date.getFullYear();
  const month = MONTHS[date.getMonth()];
  const number = date.getDate();
  return `${number} ${month} ${year}`;
};

const generateRating = () => {
  return (Math.random() * 10).toFixed(1);
};

export const generateMovieCard = () => {
  return {
    posters: SRC_IMAGES[getRandomNumber(SRC_IMAGES.length)],
    title: MOVIE_TITLES[getRandomNumber(MOVIE_TITLES.length)],
    originalTitle: MOVIE_TITLES[getRandomNumber(MOVIE_TITLES.length)],
    description: getText(generateRandomArray(getDescriptions(DESCRIPTION_TEXT), 3), ` `),
    rating: generateRating(),
    director: PEOPLE_NAMES[getRandomNumber(PEOPLE_NAMES.length)],
    writers: deleteLastItem((getText(generateRandomArray(PEOPLE_NAMES, 3), `, `))),
    actors: deleteLastItem((getText(generateRandomArray(PEOPLE_NAMES, 3), `, `))),
    releaseDate: generateDateRelease(),
    runtime: generateRunTime(),
    country: COUNTRIES[getRandomNumber(COUNTRIES.length)],
    genres: generateRandomArray(GENRES, 3),
    ageLimit: AGE_LIMITS[getRandomNumber(AGE_LIMITS.length)],
  };
};
