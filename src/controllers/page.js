import ListFilmCardsComponent from '../components/list-film-cards.js';
import ShowMoreButtonComponent from '../components/show-more-button.js';
import FilmCardComponent from '../components/film-card.js';
import AboutFilmPopupComponent from '../components/about-film.js';
import NoDataFilmComponent from '../components/no-data_film.js';
import SortFilmComponent, {SortType} from '../components/sort.js';

import {generateMovieComments} from '../mock/comment.js';
import {CARD_COUNT, MOVIE_COUNT, CARD_COUNT_TOP} from '../const.js';

import {generateRandomArray} from '../utils/utils.js';
import {render, RenderPosition, removeComponent} from '../utils/render.js';

const siteBody = document.querySelector(`body`);

// функция определяющая TOP
const isTopMovieShowing = (cards, field) => {
  return cards.some((card) => card[field] > 0);
};

const getFilteredArray = (array, i, field) => {
  return array.filter((item) => array[i][field] === item[field]);
};

const getTopMovie = (cards, field) => {
  let nextMaxElementArray = [];
  let array = cards.slice().sort((a, b) => {
    return b[field] - a[field];
  });
  let maxElementArray = getFilteredArray(array, 0, field);
  if (maxElementArray.length >= CARD_COUNT_TOP) {
    return generateRandomArray(maxElementArray, CARD_COUNT_TOP);
  } else {
    nextMaxElementArray = getFilteredArray(array, 1, field);
    return nextMaxElementArray[0][field] !== 0 ? maxElementArray.concat(generateRandomArray(nextMaxElementArray, 1)) : maxElementArray;
  }
};

const getCardShowing = (cards, start, count) => {
  return cards.slice(start, start + count);
};

let currentFilmPopup;
const renderCard = (cards, container) => {
  cards.forEach((card) => {
    const aboutFilmPopupComponent = new AboutFilmPopupComponent(card, generateMovieComments(card.commentsCount));
    const filmCardComponent = new FilmCardComponent(card);

    render(container, filmCardComponent, RenderPosition.BEFOREEND);

    const onFilmCardElementClick = () => {
      removeOpenPopupListeners();
      // проверяем есть ли открытые попапы
      if (currentFilmPopup) {
        removeComponent(currentFilmPopup);
      }
      // показать попап
      render(siteBody, aboutFilmPopupComponent, RenderPosition.BEFOREEND);
      currentFilmPopup = aboutFilmPopupComponent;
      document.addEventListener(`keydown`, onPopupEscPress);
      aboutFilmPopupComponent.setCloseButtonClickHandler(onCloseButtonClick);
    };

    const addListenerCardClick = () => {
      filmCardComponent.setPosterClickHandler(onFilmCardElementClick);
      filmCardComponent.setTitleClickHandler(onFilmCardElementClick);
      filmCardComponent.setCommentsClickHandler(onFilmCardElementClick);
    };

    addListenerCardClick();

    const removeOpenPopupListeners = () => {
      filmCardComponent.removePosterClickHandler(onFilmCardElementClick);
      filmCardComponent.removeTitleClickHandler(onFilmCardElementClick);
      filmCardComponent.removeCommentsClickHandler(onFilmCardElementClick);
    };

    const onPopupEscPress = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        onCloseButtonClick();
      }
    };

    const onCloseButtonClick = () => {
      document.removeEventListener(`keydown`, onPopupEscPress);
      removeComponent(aboutFilmPopupComponent);
      addListenerCardClick();
    };
  });
};

export default class PageController {
  constructor(container) {
    this._container = container;
    this._sortFilmComponent = new SortFilmComponent();
    this._listFilmCardsComponent = new ListFilmCardsComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._noDataFilmComponent = new NoDataFilmComponent();
  }

  render(movies) {
    const drawMovieCards = () => {
      render(this._container, this._sortFilmComponent, RenderPosition.BEFOREEND);
      render(this._container, this._listFilmCardsComponent, RenderPosition.BEFOREEND);
      const siteFilmsList = this._listFilmCardsComponent.getElement().querySelector(`.films-list`);
      const siteFilmsListContainerElements = this._listFilmCardsComponent.getElement().querySelectorAll(`.films-list__container`);
      renderCard(getCardShowing(movies, 0, CARD_COUNT), siteFilmsListContainerElements[0]);
      const siteFilmListContainerExtraElements = this._listFilmCardsComponent.getElement().querySelectorAll(`.films-list--extra`);

      if (isTopMovieShowing(movies, `rating`)) {
        renderCard(getTopMovie(movies, `rating`), siteFilmsListContainerElements[1]);
      } else {
        siteFilmListContainerExtraElements[0].classList.add(`visually-hidden`);
      }
      if (isTopMovieShowing(movies, `commentsCount`)) {
        renderCard(getTopMovie(movies, `commentsCount`), siteFilmsListContainerElements[2]);
      } else {
        siteFilmListContainerExtraElements[1].classList.add(`visually-hidden`);
      }

      // функция рендеринга кнопки и отрисовка оставшихся фильмов
      const renderShowMoreButton = (movieCards) => {
        render(siteFilmsList, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

        // показать еще карточки с фильмами
        let moviesLeft = MOVIE_COUNT - CARD_COUNT;
        const onAutoLoad = () => {
          if (moviesLeft <= 0) {
            removeComponent(this._showMoreButtonComponent);
          }
        };

        onAutoLoad();
        let start = 0;
        const onLoadCardsButtonClick = () => {
          let counter = Math.min(CARD_COUNT, moviesLeft);
          start = start + CARD_COUNT;
          renderCard(getCardShowing(movieCards, start, counter), siteFilmsListContainerElements[0]);
          moviesLeft = moviesLeft - CARD_COUNT;
          onAutoLoad();
        };
        this._showMoreButtonComponent.setClickHandler(onLoadCardsButtonClick);
      };

      renderShowMoreButton(movies);
      const sortFilmCards = (filmCards, field) => {
        return (filmCards.slice().sort((a, b) => {
          return b[field] - a[field];
        }));
      };

      this._sortFilmComponent.setSortTypeChangeHandler((sortType) => {
        let sortMovies = movies;
        switch (sortType) {
          case SortType.DATE:
            sortMovies = sortFilmCards(movies, `releaseDate`);
            break;
          case SortType.RATING:
            sortMovies = sortFilmCards(movies, `rating`);
            break;
          case SortType.DEFAULT:
            sortMovies = movies;
            break;
        }

        siteFilmsListContainerElements[0].innerHTML = ``;
        removeComponent(this._showMoreButtonComponent);
        renderCard(getCardShowing(sortMovies, 0, CARD_COUNT), siteFilmsListContainerElements[0]);
        renderShowMoreButton(sortMovies);
      }
      );

    };

    const drawMessageNoFilms = () => {
      // показать сообщение, что фильмов нет
      render(this._container, this._noDataFilmComponent, RenderPosition.BEFOREEND);
    };

    if (MOVIE_COUNT) {
      drawMovieCards();
    } else {
      drawMessageNoFilms();
    }
  }
}
