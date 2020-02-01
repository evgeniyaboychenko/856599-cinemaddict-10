import AbstractComponent from './abstract-component.js';
import {getProfileRating} from '../utils/utils.js';

const getCounWathedMovies = (movies) => {
  const showedMovies = movies.filter((item) => item.isHistory);
  return showedMovies.length;
};

// функция возвращающая Звание пользователя
const createProfileUserTemplate = (moviesModel) => {
  const profileRating = getProfileRating(getCounWathedMovies(moviesModel.getMoviesAll()));
  if (profileRating) {
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
  constructor(moviesModel) {
    super();
    this._moviesModel = moviesModel;
  }
  getTemplate() {
    return createProfileUserTemplate(this._moviesModel);
  }
}
