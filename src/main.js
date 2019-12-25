import ProfileUserComponent from './components/profile-user.js';
import MainNavigationComponent from './components/main-navigation.js';
import SortFilmComponent from './components/sort.js';
import ListFilmCardsComponent from './components/list-film-cards.js';
import ShowMoreButtonComponent from './components/show-more-button.js';
import FilmCardComponent from './components/film-card.js';
import AboutFilmPopupComponent from './components/about-film.js';
import NoDataFilmComponent from './components/no-data_film.js';

import {generateMovieCards} from './mock/movie.js';
import {generateMovieComments} from './mock/comment.js';

import {generateMovieFilters} from './mock/filters.js';

import {CARD_COUNT, MOVIE_COUNT, CARD_COUNT_TOP} from './const.js';

import {generateRandomArray} from './utils/utils.js';

import {render, RenderPosition, removeComponent} from './utils/render.js';

const movieCards = generateMovieCards(MOVIE_COUNT);
const movieFilters = generateMovieFilters(movieCards);

const siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, new ProfileUserComponent(movieFilters[1].count), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector(`.main`);
const siteBody = document.querySelector(`body`);

render(siteMainElement, new MainNavigationComponent(movieFilters), RenderPosition.BEFOREEND);
render(siteMainElement, new SortFilmComponent(), RenderPosition.BEFOREEND);

const drawMovieCards = () => {
  const listFilmCardsComponent = new ListFilmCardsComponent();
  render(siteMainElement, listFilmCardsComponent, RenderPosition.BEFOREEND);

  const showMoreButtonComponent = new ShowMoreButtonComponent();
  render(listFilmCardsComponent.getElement(), showMoreButtonComponent, RenderPosition.BEFOREEND);

  const siteFilmsListContainerElements = listFilmCardsComponent.getElement().querySelectorAll(`.films-list__container`);
  const siteFilmListContainerExtraElements = listFilmCardsComponent.getElement().querySelectorAll(`.films-list--extra`);

  const getCardShowing = (cards, start, count) => {
    return cards.slice(start, start + count);
  };

  let currentFilmPopup;

  const renderCard = (cards, container) => {
    cards.forEach((card) => {
      const aboutFilmPopupComponent = new AboutFilmPopupComponent(card, generateMovieComments(card.commentsCount));
      const filmCardComponent = new FilmCardComponent(card);

      render(container, filmCardComponent, RenderPosition.BEFOREEND);

      const filmCardPoster = filmCardComponent.getElement().querySelector(`.film-card__poster`);
      const filmCardTitle = filmCardComponent.getElement().querySelector(`.film-card__title`);
      const filmCardComments = filmCardComponent.getElement().querySelector(`.film-card__comments`);

      // const removePopup = () => {
      //   aboutFilmPopupComponent.getElement().remove();
      //   aboutFilmPopupComponent.removeElement();
      // };

      const onFilmCardElementClick = () => {
        removeOpenPopupListeners();
        // проверяем есть ли открытые попапы
        if (currentFilmPopup) {
          removeComponent(currentFilmPopup);
          // currentFilmPopup.getElement().remove();
          // currentFilmPopup.removeElement();
        }
        // показать попап
        render(siteBody, aboutFilmPopupComponent, RenderPosition.BEFOREEND);
        currentFilmPopup = aboutFilmPopupComponent;
        const closePopupButton = aboutFilmPopupComponent.getElement().querySelector(`.film-details__close-btn`);
        document.addEventListener(`keydown`, onPopupEscPress);
        // closePopupButton.addEventListener(`click`, onCloseButtonClick);
        aboutFilmPopupComponent.setCloseButtonClickHandler(onCloseButtonClick);
      };

      const addListenerCardClick = () => {
        filmCardComponent.setPosterClickHandler(onFilmCardElementClick);
        filmCardComponent.setTitleClickHandler(onFilmCardElementClick);
        filmCardComponent.setCommentsClickHandler(onFilmCardElementClick);
        // filmCardPoster.addEventListener(`click`, onFilmCardElementClick);
        // filmCardTitle.addEventListener(`click`, onFilmCardElementClick);
        // filmCardComments.addEventListener(`click`, onFilmCardElementClick);
      };

      addListenerCardClick();

      const removeOpenPopupListeners = () => {
        filmCardComponent.removePosterClickHandler(onFilmCardElementClick);
        filmCardComponent.removeTitleClickHandler(onFilmCardElementClick);
        filmCardComponent.removeCommentsClickHandler(onFilmCardElementClick);

        // filmCardPoster.removeEventListener(`click`, onFilmCardElementClick);
        // filmCardTitle.removeEventListener(`click`, onFilmCardElementClick);
        // filmCardComments.removeEventListener(`click`, onFilmCardElementClick);
      };

      const onPopupEscPress = (evt) => {
        if (evt.key === `Escape` || evt.key === `Esc`) {
          onCloseButtonClick();
        }
      };

      const onCloseButtonClick = () => {
        document.removeEventListener(`keydown`, onPopupEscPress);
        removeComponent(aboutFilmPopupComponent);
        // removePopup();
        addListenerCardClick();
      };
    });
  };

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

  renderCard(getCardShowing(movieCards, 0, CARD_COUNT), siteFilmsListContainerElements[0]);

  if (isTopMovieShowing(movieCards, `rating`)) {
    renderCard(getTopMovie(movieCards, `rating`), siteFilmsListContainerElements[1]);
  } else {
    siteFilmListContainerExtraElements[0].classList.add(`visually-hidden`);
  }
  if (isTopMovieShowing(movieCards, `commentsCount`)) {
    renderCard(getTopMovie(movieCards, `commentsCount`), siteFilmsListContainerElements[2]);
  } else {
    siteFilmListContainerExtraElements[1].classList.add(`visually-hidden`);
  }

  // показать еще карточки с фильмами
  let moviesLeft = MOVIE_COUNT - CARD_COUNT;

  const onAutoLoad = () => {
    if (moviesLeft <= 0) {
      removeComponent(showMoreButtonComponent);
      // showMoreButtonComponent.getElement().remove();
      // showMoreButtonComponent.removeElement();
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

  // showMoreButtonComponent.getElement().addEventListener(`click`, onLoadCardsButtonClick);
  showMoreButtonComponent.setClickHandler(onLoadCardsButtonClick);
};

const drawMessage = () => {
  // показать сообщение, что фильмов нет
  const noDataFilmComponent = new NoDataFilmComponent();
  render(siteMainElement, noDataFilmComponent, RenderPosition.BEFOREEND);
};

if (MOVIE_COUNT) {
  drawMovieCards();
} else {
  drawMessage();
}

// показать кол-во фильмов в футере
const siteFooterStatisticsElement = document.querySelector(`.footer__statistics`);
siteFooterStatisticsElement.querySelector(`p`).textContent = `${MOVIE_COUNT} movies inside`;
