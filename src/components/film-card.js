// import {createElement} from '../utils.js';
import AbstractComponent from './abstract-component.js';
const COMMENTS_LENGTH = 140;

// функция возвращающая Карточку фильма
const cropText = (text) => {
  return text.length > COMMENTS_LENGTH ? `${text.substr(0, COMMENTS_LENGTH - 1)}...` : text;
};

const generateDateRelease = (date) => {
  const year = date.getFullYear();
  return `${year}`;
};

const createFilmCardTemplate = (film) => {
  const {posters, title, description, rating, releaseDate, runtime, genres, commentsCount} = film;
  const shortDescription = cropText(description);
  const releaseDateYear = generateDateRelease(releaseDate);
  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseDateYear}</span>
        <span class="film-card__duration">${runtime}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="./images/posters/${posters}" alt="" class="film-card__poster">
      <p class="film-card__description">${shortDescription}</p>
      <a class="film-card__comments">${commentsCount} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
      </form>
    </article>`
  );
};

// export default class FilmCardComponent {
//   constructor(film) {
//     this._film = film;
//     this._element = null;
//   }

//   getTemplate() {
//     return createFilmCardTemplate(this._film);
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

export default class FilmCard extends AbstractComponent {
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
}
