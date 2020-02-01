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
export const generateRandomItems = (items, number) => {
  items = items.slice();
  const deleteCount = items.length - number;
  for (let i = 0; i < deleteCount; i++) {
    items.splice(getRandomNumber(items.length), 1);
  }
  return items;
};

// функция возвращающая звание пользователя
export const getProfileRating = (countWatchedFilms) => {
  if (countWatchedFilms < CountWatchedFilms.MIN) {
    return ``;
  }
  if (countWatchedFilms < CountWatchedFilms.MIDDLE) {
    return `Novice`;
  }
  if (countWatchedFilms < CountWatchedFilms.MAX) {
    return `Fan`;
  }
  return `Movie Buff`;
};

export const getDurationMovie = (time) => {
  const timeInHours = moment.duration(time, `minutes`).hours();
  const timeInMinutes = moment.duration(time, `minutes`).minutes();
  return timeInHours !== 0 ? `${timeInHours}h ${timeInMinutes}m` : `${timeInMinutes}m`;
};
