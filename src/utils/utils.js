// export const RenderPosition = {
//   AFTERBEGIN: `afterbegin`,
//   BEFOREEND: `beforeend`
// };
// // фун-ия создания DOM узда
// export const createElement = (template) => {
//   const newElement = document.createElement(`div`);
//   newElement.innerHTML = template;
//   return newElement.firstChild;
// };

// // фун-ия вставки элемента
// export const render = (container, element, place) => {
//   switch (place) {
//     case RenderPosition.AFTERBEGIN:
//       container.prepend(element);
//       break;
//     case RenderPosition.BEFOREEND:
//       container.append(element);
//       break;
//   }
// };

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
