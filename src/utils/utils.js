import moment from 'moment';

const CountWatchedFilms = {
  MIN: 1,
  MIDDLE: 11,
  MAX: 21
};

// фун-ия возвращающая случайное число [0..number)
export const getRandomNumber = (number) => {
  return Math.floor(Math.random() * number);
};

// функция возвращающая случайный массив до заданной длины
export const generateRandomArray = (array, number) => {
  array = array.slice();
  const deleteCount = array.length - number;
  for (let i = 0; i < deleteCount; i++) {
    array.splice(getRandomNumber(array.length), 1);
  }
  return array;
};

// функция возвращающая звание пользователя
export const getProfileRating = (countWatchedFilms) => {
  if (countWatchedFilms < CountWatchedFilms.MIN) {
    return ``;
  } else if (countWatchedFilms < CountWatchedFilms.MIDDLE) {
    return `Novice`;
  } else if (countWatchedFilms < CountWatchedFilms.MAX) {
    return `Fan`;
  } else {
    return `Movie Buff`;
  }
};

export const getDurationMovie = (time) => {
  const timeInHours = moment.duration(time, `minutes`).hours();
  const timeInMinutes = moment.duration(time, `minutes`).minutes();
  return timeInHours !== 0 ? `${timeInHours}h ${timeInMinutes}m` : `${timeInMinutes}m`;
};
