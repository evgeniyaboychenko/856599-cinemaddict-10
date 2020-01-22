import AbstractSmartComponent from './abstract-smart-component.js';
import moment from 'moment';
const COMMENTS_LENGTH = 140;
import {getDurationMovie} from '../utils/utils.js';

// функция возвращающая Карточку фильма
const cropText = (text) => {
  return text.length > COMMENTS_LENGTH ? `${text.substr(0, COMMENTS_LENGTH - 1)}...` : text;
};

const createFilmCardTemplate = (film) => {
  const {comments, posters, title, description, rating, releaseDate, runtime, genres, isWatchlist, isHistory, isFavorites} = film;
  const shortDescription = cropText(description);
  const releaseDateYear = moment(releaseDate).format(`YYYY`);
  const runTime = getDurationMovie(runtime);
  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseDateYear}</span>
        <span class="film-card__duration">${runTime}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="./images/posters/${posters}" alt="" class="film-card__poster">
      <p class="film-card__description">${shortDescription}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist  ${isWatchlist ? `film-card__controls-item--active` : ``}">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${isHistory ? `film-card__controls-item--active` : ``}">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${isFavorites ? `film-card__controls-item--active` : ``}">Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class FilmCard extends AbstractSmartComponent {
  constructor(film) {
    super();
    this._film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  setPosterClickHandler(handler) {
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, handler);
  }
  setTitleClickHandler(handler) {
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, handler);
  }
  setCommentsClickHandler(handler) {
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, handler);
  }

  removePosterClickHandler(handler) {
    this.getElement().querySelector(`.film-card__poster`).removeEventListener(`click`, handler);
  }
  removeTitleClickHandler(handler) {
    this.getElement().querySelector(`.film-card__title`).removeEventListener(`click`, handler);
  }
  removeCommentsClickHandler(handler) {
    this.getElement().querySelector(`.film-card__comments`).removeEventListener(`click`, handler);
  }

  setWatchlistButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, handler);
  }

  setWatchedButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, handler);
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, handler);
  }

}
