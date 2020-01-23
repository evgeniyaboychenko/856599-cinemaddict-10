import MovieModel from '../models/movie.js';
import FilmCardComponent from '../components/film-card.js';
import AboutFilmPopupComponent from '../components/about-film.js';
import {render, RenderPosition, removeComponent, replace} from '../utils/render.js';
import {FilterType} from '../const.js';
import moment from 'moment';
const siteBody = document.querySelector(`body`);
export default class MovieController {
  constructor(container, onDataChange, onViewChange, onDataCommentChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onCommentDataChange = onDataCommentChange;

    this._aboutFilmPopupComponent = null;
    this._filmCardComponent = null;
    this._userRatingComponent = null;
    this._isOpenPopup = false;
  }

  destroy() {
    removeComponent(this._filmCardComponent);
    this.setDefaultView();
  }

  setDefaultView() {
    if (this._isOpenPopup) {
      removeComponent(this._aboutFilmPopupComponent);
      this._isOpenPopup = false;
    }
  }

  render(card, comments) {
    const addListenerCardClick = () => {
      this._filmCardComponent.setPosterClickHandler(onFilmCardElementClick);
      this._filmCardComponent.setTitleClickHandler(onFilmCardElementClick);
      this._filmCardComponent.setCommentsClickHandler(onFilmCardElementClick);
    };

    const onCloseButtonClick = () => {
      document.removeEventListener(`keydown`, onPopupEscPress);
      removeComponent(this._aboutFilmPopupComponent);
      addListenerCardClick();
      this._isOpenPopup = false;
    };

    const onWatchlistButtonClick = (evt) => {
      evt.preventDefault();
      const newMovie = MovieModel.clone(card);
      newMovie.isWatchlist = !newMovie.isWatchlist;
      this._onDataChange(this, card, newMovie);
    };
    const onWatchedButtonClick = (evt) => {
      evt.preventDefault();
      const newMovie = MovieModel.clone(card);
      newMovie.isHistory = !newMovie.isHistory;
      newMovie.userRating = 0;
      newMovie.watchingDate = moment().format();
      this._onDataChange(this, card, newMovie);
    };

    const onFavoriteButtonClick = (evt) => {
      evt.preventDefault();
      const newMovie = MovieModel.clone(card);
      newMovie.isFavorites = !newMovie.isFavorites;
      this._onDataChange(this, card, newMovie);
    };

    const onUserRatingButtonClick = (userRating) => {
      const newMovie = MovieModel.clone(card);
      newMovie.userRating = Number(userRating);
      this._onDataChange(this, card, newMovie);
    };

    const onCommentDeleteButtonClick = (idComment) => {
      this._onCommentDataChange(this, card.id, idComment, null);
    };

    const onCommentAdd = (localComment) => {
      this._onCommentDataChange(this, card.id, null, localComment);
    };

    const oldAboutFilmPopupComponent = this._aboutFilmPopupComponent;
    const oldFilmCardComponent = this._filmCardComponent;

    this._aboutFilmPopupComponent = new AboutFilmPopupComponent(card, comments);

    this._filmCardComponent = new FilmCardComponent(card);

    if (oldAboutFilmPopupComponent && oldFilmCardComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
      if (replace(this._aboutFilmPopupComponent, oldAboutFilmPopupComponent)) {
        this._aboutFilmPopupComponent.addEmojiHandler();
        this._aboutFilmPopupComponent.setCloseButtonClickHandler(onCloseButtonClick);

        this._aboutFilmPopupComponent.setWatchlistButtonClickHandler(onWatchlistButtonClick);
        this._aboutFilmPopupComponent.setWatchedButtonClickHandler(onWatchedButtonClick);
        this._aboutFilmPopupComponent.setFavoriteButtonClickHandler(onFavoriteButtonClick);

        this._aboutFilmPopupComponent.setCommentDeleteButtonClickHandler(onCommentDeleteButtonClick);
        this._aboutFilmPopupComponent.setCommentAddHandler(onCommentAdd);

        this._aboutFilmPopupComponent.setUserRatingButtonClickHandler(onUserRatingButtonClick);
        this._aboutFilmPopupComponent.setUndoButtonClickHandler(onUserRatingButtonClick);
      }
    } else {
      render(this._container, this._filmCardComponent, RenderPosition.BEFOREEND);
    }

    this._filmCardComponent.setWatchlistButtonClickHandler(onWatchlistButtonClick);
    this._filmCardComponent.setWatchedButtonClickHandler(onWatchedButtonClick);
    this._filmCardComponent.setFavoriteButtonClickHandler(onFavoriteButtonClick);

    const onFilmCardElementClick = () => {
      this._onViewChange();
      // показать попап
      this._aboutFilmPopupComponent.resetState();
      render(siteBody, this._aboutFilmPopupComponent, RenderPosition.BEFOREEND);
      this._isOpenPopup = true;

      document.addEventListener(`keydown`, onPopupEscPress);
      this._aboutFilmPopupComponent.addEmojiHandler();

      this._aboutFilmPopupComponent.setCloseButtonClickHandler(onCloseButtonClick);

      this._aboutFilmPopupComponent.setWatchlistButtonClickHandler(onWatchlistButtonClick);
      this._aboutFilmPopupComponent.setWatchedButtonClickHandler(onWatchedButtonClick);
      this._aboutFilmPopupComponent.setFavoriteButtonClickHandler(onFavoriteButtonClick);

      this._aboutFilmPopupComponent.setCommentDeleteButtonClickHandler(onCommentDeleteButtonClick);
      this._aboutFilmPopupComponent.setCommentAddHandler(onCommentAdd);

      this._aboutFilmPopupComponent.setUserRatingButtonClickHandler(onUserRatingButtonClick);
      this._aboutFilmPopupComponent.setUndoButtonClickHandler(onUserRatingButtonClick);
    };

    addListenerCardClick();

    const onPopupEscPress = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        onCloseButtonClick();
      }
    };
  }
}
