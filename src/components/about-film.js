import AbstractSmartComponent from './abstract-smart-component.js';
import {EmojiType} from '../const.js';
import moment from 'moment';
import {getDurationMovie} from '../utils/utils.js';
import LocalComment from '../models/local-comment.js';

const EndingWordGenre = {MULTIPLE: `s`, ZERO: ``};
const UserRating = {
  MIN: 1,
  MAX: 9
};

const createGenresMarkup = (genres) => {
  return genres.map((genre) => {
    return (
      `<span class="film-details__genre">${genre}</span>`
    );
  })
    .join(`\n`);
};

const createCommentsMarkup = (comments) => {
  return comments.map((comment) => {
    const commentDate = moment(comment.dateComment).format(`YYYY/MM/DD HH:mm`);
    return (
      `<li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${comment.emoji}.png" width="55" height="55" alt="emoji">
        </span>
        <div>
          <p class="film-details__comment-text">${comment.textComment}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${comment.autorComment}</span>
            <span class="film-details__comment-day">${commentDate}</span>
            <button class="film-details__comment-delete" value="${comment.id}">Delete</button>
          </p>
        </div>
      </li>`
    );
  })
.join(`\n`);
};

const createUserRatingMarkup = (userRating) => {
  const r = [];
  for (let i = UserRating.MIN; i <= UserRating.MAX; i++) {
    r.push(`<input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${i}" id="rating-${i}" ${i === userRating ? `checked` : ``}>
    <label class="film-details__user-rating-label" for="rating-${i}">${i}</label>`);
  }
  return r.join(`\n`);
};

const determineEndingWordGenre = (number) => {
  return number > 1 ? EndingWordGenre.MULTIPLE : EndingWordGenre.ZERO;
};

// функция возвращающая Popup о фильме
const createAboutFilmPopupTemplate = (film, commentsFilm, selectedEmoji, textComment) => {
  const {comments, poster, title, originalTitle, description, rating, director, writers, actors, releaseDate, runtime, country, genres, ageLimit, isWatchlist, isHistory, isFavorites, userRating} = film;
  const genresMarkup = createGenresMarkup(genres);
  const userRatingMarkup = createUserRatingMarkup(userRating);
  const releaseDateFull = moment(releaseDate).format(`DD MMMM YYYY`);
  const runTime = getDurationMovie(runtime);
  const commentsMarkup = createCommentsMarkup(commentsFilm);

  const getCheckedInput = (emoji) => {
    return selectedEmoji === emoji ? `checked` : ``;
  };

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./${poster}" alt="">

              <p class="film-details__age">${ageLimit}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${originalTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                  ${isHistory && userRating ? `<p class="film-details__user-rating">Your rate ${userRating} </p>` : ``}
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${releaseDateFull}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${runTime}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genre${determineEndingWordGenre(genres.length)}</td>
                  <td class="film-details__cell">
                    ${genresMarkup}
                  </td>
                </tr>
              </table>

              <p class="film-details__film-description">
               ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isWatchlist ? `checked` : ``}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isHistory ? `checked` : ``} >
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorites ? `checked` : ``}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>

        ${isHistory ?
      `<div class="form-details__middle-container">
          <section class="film-details__user-rating-wrap">
            <div class="film-details__user-rating-controls">
              <button class="film-details__watched-reset" type="button">Undo</button>
            </div>

            <div class="film-details__user-score">
              <div class="film-details__user-rating-poster">
                <img src="./${poster}" alt="film-poster" class="film-details__user-rating-img">
              </div>

              <section class="film-details__user-rating-inner">
                <h3 class="film-details__user-rating-title">${title}</h3>

                <p class="film-details__user-rating-feelings">How you feel it?</p>

                <div class="film-details__user-rating-score">
                  ${userRatingMarkup}
                </div>
              </section>
            </div>
          </section>
        </div>` : ``}

        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

            <ul class="film-details__comments-list">
              ${commentsMarkup}
            </ul>

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label">
              ${selectedEmoji ? `<img src="images/emoji/${selectedEmoji}.png" width="55" height="55" alt="emoji">` : ``}
              </div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here"  name="comment">${textComment ? textComment : ``}</textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden"  data-emoji-type="${EmojiType.SMILE}" ${getCheckedInput(EmojiType.SMILE)} name="comment-emoji" type="radio" id="emoji-smile" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" data-emoji-type="${EmojiType.SLEEPING}" ${getCheckedInput(EmojiType.SLEEPING)} name="comment-emoji" type="radio" id="emoji-sleeping" value="neutral-face">
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" data-emoji-type="${EmojiType.PUKE}" ${getCheckedInput(EmojiType.PUKE)} name="comment-emoji" type="radio" id="emoji-gpuke" value="grinning">
                <label class="film-details__emoji-label" for="emoji-gpuke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" data-emoji-type="${EmojiType.ANGRY}" ${getCheckedInput(EmojiType.ANGRY)} name="comment-emoji" type="radio" id="emoji-angry" value="grinning">
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export const generateDateComment = () => {
  return moment().toDate();
};

export default class AboutFilmPopup extends AbstractSmartComponent {
  constructor(film, comments) {
    super();
    this._film = film;
    this._comments = comments;
    this._textComment = null;
    this._currentEmoji = null;
    this._currentUserRating = 0;
    this._defaultUserRating = this._film.userRating;
    this.setCommentsMovie = this.setCommentsMovie.bind(this);
  }

  getTextareaComment() {
    return this.getElement().querySelector(`.film-details__comment-input`);
  }


  getTemplate() {
    return createAboutFilmPopupTemplate(this._film, this._comments, this._currentEmoji, this._textComment);
  }

  getButtonDelete(idComment) {
    return this.getElement().querySelector(`button[value = "${idComment}"]`);
  }

  setDisabledButtonDelete(idComment) {
    this.getButtonDelete(idComment).textContent = `Deleting...`;
    this.getButtonDelete(idComment).setAttribute(`disabled`, `disabled`);
  }

  setDefaultButtonDelete(idComment) {
    this.getButtonDelete(idComment).textContent = `Delete`;
    this.getButtonDelete(idComment).removeAttribute(`disabled`);
  }

  setDisabledTextareaComment() {
    this.getTextareaComment().setAttribute(`disabled`, `disabled`);
  }

  setDefaultTextareaComment() {
    this.getTextareaComment().removeAttribute(`disabled`);
  }

  setDisabledUserRatingInput() {
    this.getElement().querySelectorAll(`.film-details__user-rating-input`).forEach((item) => item.setAttribute(`disabled`, `disabled`));
  }

  setBackgroundUserRatingInput() {
    if (this._currentUserRating) {
      this.getElement().querySelector(`#rating-${this._currentUserRating} + .film-details__user-rating-label`).style.backgroundColor = `red`;
    }
  }

  setDefaultUserRatingInput() {
    if (this._currentUserRating) {
      this.getElement().querySelector(`#rating-${this._currentUserRating} + .film-details__user-rating-label`).style.backgroundColor = `#d8d8d8`;
    }

    if (this._defaultUserRating) {
      this.getElement().querySelector(`#rating-${this._defaultUserRating} + .film-details__user-rating-label`).style.backgroundColor = `#ffe800`;
    }
    this.getElement().querySelectorAll(`.film-details__user-rating-input`).forEach((item) => item.removeAttribute(`disabled`));
  }

  setCloseButtonListener(onCloseButtonClick) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, onCloseButtonClick);
  }

  setCloseButtonClickHandler(handler) {
    this._onCloseButtonClick = handler;
    this.setCloseButtonListener(this._onCloseButtonClick);
  }

  setWatchlistButtonListener(onWatchlistButtonClick) {
    this.getElement().querySelector(`#watchlist`).addEventListener(`click`, onWatchlistButtonClick);
  }

  setWatchedButtonListener(onWatchedButtonClick) {
    this.getElement().querySelector(`#watched`).addEventListener(`click`, onWatchedButtonClick);
  }

  setFavoriteButtonListener(onFavoriteButtonClick) {
    this.getElement().querySelector(`#favorite`).addEventListener(`click`, onFavoriteButtonClick);
  }

  setWatchlistButtonClickHandler(handler) {
    this._onWatchlistButtonClick = handler;
    this.setWatchlistButtonListener(this._onWatchlistButtonClick);
  }

  setWatchedButtonClickHandler(handler) {
    this._onWatchedButtonClick = handler;
    this.setWatchedButtonListener(this._onWatchedButtonClick);
  }

  setFavoriteButtonClickHandler(handler) {
    this._onFavoriteButtonClick = handler;
    this.setFavoriteButtonListener(this._onFavoriteButtonClick);
  }

  setUserRatingButtonListener(onUserRatingButtonClick) {
    if (this.getElement().querySelector(`.film-details__user-rating-score`)) {
      this.getElement().querySelector(`.film-details__user-rating-score`).addEventListener(`click`, (evt) => {
        if (evt.target.tagName !== `INPUT`) {
          return;
        }
        const userRating = Number(evt.target.value);
        if (this._currentUserRating === userRating) {
          return;
        }
        this._currentUserRating = userRating;
        onUserRatingButtonClick(this._currentUserRating);
      });
    }
  }

  setUserRatingButtonClickHandler(handler) {
    this._onUserRatingButtonClick = handler;
    this.setUserRatingButtonListener(this._onUserRatingButtonClick);
  }

  setUndoButtonListener(onUndoButtonClick) {
    if (this.getElement().querySelector(`.film-details__watched-reset`)) {
      this.getElement().querySelector(`.film-details__watched-reset`).addEventListener(`click`, () => {
        this._currentUserRating = 0;
        onUndoButtonClick(this._currentUserRating);
      });
    }
  }

  setUndoButtonClickHandler(handler) {
    this._onUndoButtonClick = handler;
    this.setUndoButtonListener(this._onUndoButtonClick);
  }

  setCommentDeleteListener(onCommentDelete) {
    this.getElement().querySelector(`.film-details__comments-list`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (evt.target.tagName !== `BUTTON`) {
        return;
      }
      const currentIdComment = evt.target.value;
      onCommentDelete(currentIdComment);
    });
  }

  setCommentDeleteHandler(handler) {
    this._onCommentDelete = handler;
    this.setCommentDeleteListener(this._onCommentDelete);
  }

  setCommentAddListener(onCommentAdd) {
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`keydown`, (evt) => {
      if (evt.key === `Enter` && evt.ctrlKey) {
        this._saveTextComment();
        if (this._textComment && this._currentEmoji) {
          const localComment = new LocalComment(generateDateComment(), this._textComment, this._currentEmoji);
          onCommentAdd(localComment);
        }
      }
    });
  }

  setCommentAddHandler(handler) {
    this._onCommentAdd = handler;
    this.setCommentAddListener(this._onCommentAdd);
  }

  setCommentsMovie(comments) {
    this._comments = comments;
  }

  addEmojiHandler() {
    this._addEmojiClickListener();
  }

  resetState() {
    this._currentEmoji = null;
    this._textComment = null;
  }

  recoveryListeners() {
    this._subscribeOnEvents();
  }

  _saveTextComment() {
    this._textComment = this.getElement().querySelector(`.film-details__comment-input`).value;
  }

  _onEmojiUpdate(emoji) {
    this._currentEmoji = emoji;
    this._saveTextComment();
    this.rerender();
  }

  _subscribeOnEvents() {
    this.addEmojiHandler();

    if (this._onCloseButtonClick) {
      this.setCloseButtonListener(this._onCloseButtonClick);
    }

    if (this._onWatchlistButtonClick) {
      this.setWatchlistButtonListener(this._onWatchlistButtonClick);
    }
    if (this._onWatchedButtonClick) {
      this.setWatchedButtonListener(this._onWatchedButtonClick);
    }
    if (this._onFavoriteButtonClick) {
      this.setFavoriteButtonListener(this._onFavoriteButtonClick);
    }

    if (this._onUserRatingButtonClick) {
      this.setUserRatingButtonListener(this._onUserRatingButtonClick);
    }

    if (this._onUndoButtonClick) {
      this.setUndoButtonListener(this._onUndoButtonClick);
    }

    if (this._onCommentDelete) {
      this.setCommentDeleteListener(this._onCommentDelete);
    }

    if (this._onCommentAdd) {
      this.setCommentAddListener(this._onCommentAdd);
    }
  }

  _addEmojiClickListener() {
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`click`, (evt) => {

      if (evt.target.tagName !== `INPUT`) {
        return;
      }
      const emojiType = evt.target.dataset.emojiType;
      if (this._currentEmoji === emojiType) {
        return;
      }
      this._onEmojiUpdate(emojiType);
    });
  }
}
