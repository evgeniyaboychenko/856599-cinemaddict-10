import AbstractComponent from './abstract-component.js';
import {getProfileRating} from '../utils/utils.js';

// функция возвращающая Звание пользователя
const createProfileUserTemplate = (countWatchedFilms) => {
  const profileRating = getProfileRating(countWatchedFilms);
  console.log(countWatchedFilms);
  if(profileRating) {
    return (
      `<section class="header__profile profile">
        <p class="profile__rating">${profileRating}</p>
        <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      </section>`
    );
  }
  return `<div></div>`;
};

export default class ProfileUser extends AbstractComponent {
  constructor(countWatchedFilms) {
    super();
    this._countWatchedFilms = countWatchedFilms;
  }
  getTemplate() {
    return createProfileUserTemplate(this._countWatchedFilms);
  }
}
