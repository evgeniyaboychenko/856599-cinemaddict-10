import MovieModel from '../models/movie.js';
import FilmCardComponent from '../components/film-card.js';
import AboutFilmPopupComponent from '../components/about-film.js';
import {render, RenderPosition, removeComponent, replace} from '../utils/render.js';
import moment from 'moment';
const SHAKE_ANIMATION_TIMEOUT = 600;
const MILLISECONDS_IN_SECONDS = 1000;
const siteBody = document.querySelector(`body`);

export const OperationType = {
  DELETE_COMMENT: `delete`,
  CREATE_COMMENT: `create`,
  SET_USER_RATING: `set`,
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange, onDataCommentChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onCommentDataChange = onDataCommentChange;

    this._aboutFilmPopupComponent = null;
    this._filmCardComponent = null;
    this._isOpenPopup = false;
    this._comments = [];
    this._loadComments = null;
  }

  setDefaultView() {
    if (this._isOpenPopup) {
      removeComponent(this._aboutFilmPopupComponent);
      this._isOpenPopup = false;
    }
  }

  destroy() {
    removeComponent(this._filmCardComponent);
    this.setDefaultView();
  }

  shake(operationType, idComment) {
    this._aboutFilmPopupComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / MILLISECONDS_IN_SECONDS}s`;
    if (operationType === OperationType.SET_USER_RATING) {
      this._aboutFilmPopupComponent.setBackgroundUserRatingInput();
    }
    setTimeout(() => {
      this._aboutFilmPopupComponent.getElement().style.animation = ``;
      switch (operationType) {
        case OperationType.DELETE_COMMENT:
          this._aboutFilmPopupComponent.setDefaultButtonDelete(idComment);
          return;
        case OperationType.CREATE_COMMENT:
          this._aboutFilmPopupComponent.setDefaultTextareaComment();
          return;
        case OperationType.SET_USER_RATING:
          this._aboutFilmPopupComponent.getElement().style.animation = ``;
          this._aboutFilmPopupComponent.setDefaultUserRatingInput();
          return;
      }
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  render(card, loadComments) {
    this._loadComments = loadComments;

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
      this._aboutFilmPopupComponent.setDisabledUserRatingInput(userRating);
      this._onDataChange(this, card, newMovie);
    };

    const onCommentDelete = (idComment) => {
      this._aboutFilmPopupComponent.setDisabledButtonDelete(idComment);
      this._onCommentDataChange(this, card.id, idComment, null);
    };

    const onCommentAdd = (localComment) => {
      this._aboutFilmPopupComponent.setDisabledTextareaComment();
      this._onCommentDataChange(this, card.id, null, localComment);
    };

    const setPopupsHandler = () => {
      this._aboutFilmPopupComponent.addEmojiHandler();
      this._aboutFilmPopupComponent.setCloseButtonClickHandler(onCloseButtonClick);

      this._aboutFilmPopupComponent.setWatchlistButtonClickHandler(onWatchlistButtonClick);
      this._aboutFilmPopupComponent.setWatchedButtonClickHandler(onWatchedButtonClick);
      this._aboutFilmPopupComponent.setFavoriteButtonClickHandler(onFavoriteButtonClick);

      this._aboutFilmPopupComponent.setCommentDeleteHandler(onCommentDelete);
      this._aboutFilmPopupComponent.setCommentAddHandler(onCommentAdd);

      this._aboutFilmPopupComponent.setUserRatingButtonClickHandler(onUserRatingButtonClick);
      this._aboutFilmPopupComponent.setUndoButtonClickHandler(onUserRatingButtonClick);
    };

    const oldAboutFilmPopupComponent = this._aboutFilmPopupComponent;
    const oldFilmCardComponent = this._filmCardComponent;

    this._aboutFilmPopupComponent = new AboutFilmPopupComponent(card, []);
    this._filmCardComponent = new FilmCardComponent(card);

    this._aboutFilmPopupComponent.setCommentsMovie(this._comments);

    if (oldAboutFilmPopupComponent && oldFilmCardComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);

      if (this._isOpenPopup) {
        if (this._comments.length !== card.comments.length) {
          this._loadComments(card)
          .then((comments) => {
            this._comments = comments;
            this._aboutFilmPopupComponent.setCommentsMovie(this._comments);
            if (replace(this._aboutFilmPopupComponent, oldAboutFilmPopupComponent)) {
              setPopupsHandler();
            }
          });
        } else {
          if (replace(this._aboutFilmPopupComponent, oldAboutFilmPopupComponent)) {
            setPopupsHandler();
          }
        }
      }
    } else {
      render(this._container, this._filmCardComponent, RenderPosition.BEFOREEND);
    }

    this._filmCardComponent.setWatchlistButtonClickHandler(onWatchlistButtonClick);
    this._filmCardComponent.setWatchedButtonClickHandler(onWatchedButtonClick);
    this._filmCardComponent.setFavoriteButtonClickHandler(onFavoriteButtonClick);

    const onFilmCardElementClick = () => {
      this._onViewChange();

      this._loadComments(card)
      .then((comments) => {
        this._comments = comments;

        this._aboutFilmPopupComponent.setCommentsMovie(this._comments);
        this._aboutFilmPopupComponent.resetState();
        render(siteBody, this._aboutFilmPopupComponent, RenderPosition.BEFOREEND);
        this._isOpenPopup = true;
        document.addEventListener(`keydown`, onPopupEscPress);
        setPopupsHandler();
      });
    };

    addListenerCardClick();
    const onPopupEscPress = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        onCloseButtonClick();
      }
    };
  }
}
