// import {createElement} from '../utils.js';
import AbstractComponent from './abstract-component.js';

const getProfileRating = (countWatchedFilms) => {
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

// функция возвращающая Звание пользователя
const createProfileUserTemplate = (countWatchedFilms) => {
  const profileRating = getProfileRating(countWatchedFilms);
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${profileRating}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

// export default class ProfileUserComponent {
//   constructor(countWatchedFilms) {
//     this._countWatchedFilms = countWatchedFilms;
//     this._element = null;
//   }

//   getTemplate() {
//     return createProfileUserTemplate(this._countWatchedFilms);
//   }

//   getElement() {
//     if (!this._element) {
//       this._element = createElement(this.getTemplate());
//     }

//     return this._element;
//   }

//   removeElement() {
//     this._element = null;
//   }
// }

export default class ProfileUser extends AbstractComponent {
  constructor(countWatchedFilms) {
    super();
    this._countWatchedFilms = countWatchedFilms;
    //  this._element = null;
  }

  getTemplate() {
    return createProfileUserTemplate(this._countWatchedFilms);
  }
}
