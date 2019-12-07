// фун-ия возвращающая случайное число [0..number)

export const getRandomNumber = (number) => {
  return Math.floor(Math.random() * number);
};

// фун-ия возвращающая случайное число в промежутке [min, max)
export const getRandomRange = function (min, max) {
  return min + getRandomNumber(max - min);
};

// export const generateFlagValue = () => {
//   return Boolean(getRandomNumber(2));
// };

// функция возвращающая случайный массив заданной длины
export const generateRandomArray = (array, number) => {
  array = array.slice();
  const deleteCount = array.length - getRandomRange(1, number + 1);
  for (let i = 0; i < deleteCount; i++) {
    array.splice(getRandomNumber(array.length), 1);
  }
  return array;
};

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatTime = (date) => {
  let hours = date.getHours() % 12;
  hours = hours === 0 ? 12 : hours;
  const minutes = castTimeFormat(date.getMinutes());
  const interval = date.getHours() > 11 ? `pm` : `am`;
  return `${castTimeFormat(hours)}:${minutes} ${interval}`;
};


