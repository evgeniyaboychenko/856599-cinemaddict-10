import FilmCardComponent from '../components/film-card.js';
import AboutFilmPopupComponent from '../components/about-film.js';
import UserRatingComponent from '../components/user-rating.js';


import {generateMovieComments} from '../mock/comment.js';
const siteBody = document.querySelector(`body`);
import {render, RenderPosition, removeComponent, replace} from '../utils/render.js';
let currentFilmPopup;

export default class MovieController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;

    this._aboutFilmPopupComponent = null;
    this._filmCardComponent = null;

  }

  render(card) {
    const oldAboutFilmPopupComponent = this._aboutFilmPopupComponent;
    const oldFilmCardComponent = this._filmCardComponent;


    this._aboutFilmPopupComponent = new AboutFilmPopupComponent(card, generateMovieComments(card.commentsCount));
    this._filmCardComponent = new FilmCardComponent(card);


    if (oldAboutFilmPopupComponent && oldFilmCardComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      replace(this._aboutFilmPopupComponent, oldAboutFilmPopupComponent);
    } else {
      render(this._container, this._filmCardComponent, RenderPosition.BEFOREEND);
    }


    const onWatchlistButtonClick = (evt) => {
      evt.preventDefault();
      let newCard = Object.assign({}, card);
      newCard.isWatchlist = !newCard.isWatchlist;
      this._onDataChange(this, card, newCard);
    };

    const onWatchedButtonClick = (evt) => {
      evt.preventDefault();
      let newCard = Object.assign({}, card);
      newCard.isHistory = !newCard.isHistory;
      this._onDataChange(this, card, newCard);
    };

    const onFavoriteButtonClick = (evt) => {
      evt.preventDefault();
      let newCard = Object.assign({}, card);
      newCard.isFavorites = !newCard.isFavorites;
      this._onDataChange(this, card, newCard);
    };

    this._filmCardComponent.setWatchlistButtonClickHandler(onWatchlistButtonClick);
    this._filmCardComponent.setWatchedButtonClickHandler(onWatchedButtonClick);
    this._filmCardComponent.setFavoriteButtonClickHandler(onFavoriteButtonClick);

    const onFilmCardElementClick = () => {
      removeOpenPopupListeners();
      // проверяем есть ли открытые попапы
      if (currentFilmPopup) {
        removeComponent(currentFilmPopup);
      }

      // показать попап
      render(siteBody, this._aboutFilmPopupComponent, RenderPosition.BEFOREEND);

      // показать блок с оценкой пользователя для просмотренного фильма
      if (card.isHistory) {
        const userRatingComponent = new UserRatingComponent();
        render(this._aboutFilmPopupComponent.getElement().querySelector(`.form-details__top-container`), userRatingComponent, RenderPosition.AFTEREND);
      }

      currentFilmPopup = this._aboutFilmPopupComponent;

      document.addEventListener(`keydown`, onPopupEscPress);
      this._aboutFilmPopupComponent.setCloseButtonClickHandler(onCloseButtonClick);
    };


    const addListenerCardClick = () => {
      this._filmCardComponent.setPosterClickHandler(onFilmCardElementClick);
      this._filmCardComponent.setTitleClickHandler(onFilmCardElementClick);
      this._filmCardComponent.setCommentsClickHandler(onFilmCardElementClick);
    };

    addListenerCardClick();

    const removeOpenPopupListeners = () => {
      this._filmCardComponent.removePosterClickHandler(onFilmCardElementClick);
      this._filmCardComponent.removeTitleClickHandler(onFilmCardElementClick);
      this._filmCardComponent.removeCommentsClickHandler(onFilmCardElementClick);
    };

    const onPopupEscPress = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        onCloseButtonClick();
      }
    };

    const onCloseButtonClick = () => {
      document.removeEventListener(`keydown`, onPopupEscPress);
      removeComponent(this._aboutFilmPopupComponent);
      addListenerCardClick();
    };
  }
}

