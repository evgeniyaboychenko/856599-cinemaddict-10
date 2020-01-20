import moment from 'moment';
// фун-ия возвращающая случайное число [0..number)
export const getRandomNumber = (number) => {
  return Math.floor(Math.random() * number);
};
// фун-ия возвращающая true или false
export const generateFlagValue = () => {
  return Boolean(getRandomNumber(2));
};

// фун-ия возвращающая случайное число в промежутке [min, max)
export const getRandomRange = function (min, max) {
  return min + getRandomNumber(max - min);
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

export const getObjectsArray = (obj, count) => {
  return new Array(count)
    .fill(``).map(obj);
};

// функция возвращающая звание пользователя
export const getProfileRating = (countWatchedFilms) => {
  if (countWatchedFilms < 1) {
    return ``;
  } else if (countWatchedFilms < 11) {
    return `Novice`;
  } else if (countWatchedFilms < 21) {
    return `Fan`;
  } else {
    return `Movie Buff`;
  }
};

export const getDurationMovie = (time) => {
  const timeInHours = moment.duration(time, "minutes").hours();
  const timeInMinutes = moment.duration(time, "minutes").minutes();
  return timeInHours !==0 ? `${timeInHours}h ${timeInMinutes}m`: `${timeInMinutes}m`;
};
