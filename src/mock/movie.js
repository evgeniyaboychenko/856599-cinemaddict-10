import {getRandomNumber} from '../utils/utils.js';
import {getRandomRange} from '../utils/utils.js';
import {generateRandomArray} from '../utils/utils.js';
import {generateFlagValue} from '../utils/utils.js';
import {getObjectsArray} from '../utils/utils.js';
import moment from 'moment';


const MOVIE_TITLES = [`Frozen II`, `The Shawshank Redemption`, `Forrest Gump`, `The Matrix`, `The Matrix`, `The Lord of the Rings: The Fellowship of the Ring`, `Pulp Fiction`, `The Silence of the Lambs`, `Saving Private Ryan`, `Gladiator`, `Se7en`];
const COUNTRIES = [`Russia`, `USA`, `Spain`, `UC`, `Japan`, `Finland`, `Israel`, `Poland`, `Thailand`, `Turkey`];
const PEOPLE_NAMES = [`Rachel Matthews`, `Alan Tudyk`, `Hadley Gannaway`, `Kristen Bell`, `Frank Darabont`, `Stephen King`, `Tim Robbins`, `Morgan Freeman`, `Bob Gunton`, `Tom Hanks`, `Robin Wright`, `Gary Sinise`];
const GENRES = [`Horror`, `Adventure`, `Action`, `Sci-Fi`, `Drama`, `Fantasy`, `Romance`, `Western`, `Crime`, `Triller`];
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

// const generateRunTime = () => {
//   let date = new Date();
//   date.setHours(getRandomRange(0, 4));
//   date.setMinutes(getRandomRange(0, 60));
//   const hours = date.getHours() < 1 ? `` : `${date.getHours()}h`;
//   const minute = date.getMinutes();
//   return `${hours} ${minute}min`;
// };

// const getDateRelease = () => {
//   let dateRelese = moment(1475924187819).format(`DD MMMM YYYY`);
//   console.log(dateRelese);
//   let date = new Date();
//   date.setFullYear(getRandomRange(1920, date.getFullYear()), getRandomNumber(12), getRandomNumber(31));
//   return date;
// };

const generateRating = () => {
  return (Math.random() * 10).toFixed(1);
};

export const generateMovieCard = () => {
  return {
    id: String(new Date().valueOf() + Math.random()),
    posters: SRC_IMAGES[getRandomNumber(SRC_IMAGES.length)],
    title: MOVIE_TITLES[getRandomNumber(MOVIE_TITLES.length)],
    originalTitle: MOVIE_TITLES[getRandomNumber(MOVIE_TITLES.length)],
    description: getText(generateRandomArray(getDescriptions(DESCRIPTION_TEXT), getRandomRange(1, 4)), ` `),
    rating: generateRating(),
    userRating: getRandomRange(1, 10),
    director: PEOPLE_NAMES[getRandomNumber(PEOPLE_NAMES.length)],
    writers: deleteLastItem((getText(generateRandomArray(PEOPLE_NAMES, 3), `, `))),
    actors: deleteLastItem((getText(generateRandomArray(PEOPLE_NAMES, 3), `, `))),
    releaseDate: getRandomRange(1661954344, 1579498575391),
    runtime: getRandomRange(30, 320),
    country: COUNTRIES[getRandomNumber(COUNTRIES.length)],
    genres: generateRandomArray(GENRES, getRandomRange(1, 4)),
    ageLimit: AGE_LIMITS[getRandomNumber(AGE_LIMITS.length)],
    isWatchlist: generateFlagValue(),
    isHistory: false,//generateFlagValue(),
    isFavorites: generateFlagValue(),
    watching_date: moment().subtract(getRandomNumber(2), 'year').subtract(getRandomNumber(24), 'hours').subtract(getRandomNumber(7), 'days').subtract(getRandomNumber(0), 'months').format(),
  };
};
export const generateMovieCards = (count) => {
  return getObjectsArray(generateMovieCard, count);
};
