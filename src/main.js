import ProfileUserComponent from './components/profile-user.js';
import MainNavigationComponent from './components/main-navigation.js';
import SortFilmComponent from './components/sort.js';
import ListFilmCardsComponent from './components/list-film-cards.js';
import ShowMoreButtonComponent from './components/show-more-button.js';
import FilmCardComponent from './components/film-card.js';
import AboutFilmPopupComponent from './components/about-film.js';

import {generateMovieCards} from './mock/movie.js';
import {generateMovieComments} from './mock/comment.js';

import {generateMovieFilters} from './mock/filters.js';

import {CARD_COUNT, MOVIE_COUNT, CARD_COUNT_TOP} from './const.js';

import {generateRandomArray} from './utils.js';

import {render, RenderPosition} from './utils.js';

const movieCards = generateMovieCards(MOVIE_COUNT);
const movieFilters = generateMovieFilters(movieCards);

const siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, new ProfileUserComponent(movieFilters[1].count).getElement(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector(`.main`);
const siteBody = document.querySelector(`body`);

render(siteMainElement, new MainNavigationComponent(movieFilters).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new SortFilmComponent().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new ListFilmCardsComponent().getElement(), RenderPosition.BEFOREEND);

const siteFilmsElement = siteMainElement.querySelector(`.films`);
const showMoreButtonComponent = new ShowMoreButtonComponent();
render(siteFilmsElement, showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);


const siteFilmsListContainerElements = siteFilmsElement.querySelectorAll(`.films-list__container`);
const siteFilmListContainerExtraElements = siteFilmsElement.querySelectorAll(`.films-list--extra`);

const getCardShowing = (cards, start, count) => {
  return cards.slice(start, start + count);
};

const renderCard = (cards, container) => {
  cards.forEach((card) => {
    const aboutFilmPopupComponent = new AboutFilmPopupComponent(card, generateMovieComments(card.commentsCount));
    const filmCardComponent = new FilmCardComponent(card);

    render(container, filmCardComponent.getElement(), RenderPosition.BEFOREEND);

    const filmCardPoster = filmCardComponent.getElement().querySelector(`.film-card__poster`);
    const filmCardTitle = filmCardComponent.getElement().querySelector(`.film-card__title`);
    const filmCardComments = filmCardComponent.getElement().querySelector(`.film-card__comments`);

    const onFilmCardElementClick = () => {
      deleteListenerPopupButtonCloseClick();
      // показать попап
      render(siteBody, aboutFilmPopupComponent.getElement(), RenderPosition.BEFOREEND);
      const closePopupButton = aboutFilmPopupComponent.getElement().querySelector(`.film-details__close-btn`);
      document.addEventListener(`keydown`, onPopupEscPress);
      closePopupButton.addEventListener(`click`, onCloseButtonClick);
    };

    const addListenerCardClick = () => {
      filmCardPoster.addEventListener(`click`, onFilmCardElementClick);
      filmCardTitle.addEventListener(`click`, onFilmCardElementClick);
      filmCardComments.addEventListener(`click`, onFilmCardElementClick);
    };

    addListenerCardClick();

    const deleteListenerPopupButtonCloseClick = () => {
      filmCardPoster.removeEventListener(`click`, onFilmCardElementClick);
      filmCardTitle.removeEventListener(`click`, onFilmCardElementClick);
      filmCardComments.removeEventListener(`click`, onFilmCardElementClick);
    };

    const onPopupEscPress = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        onCloseButtonClick();
      }
    };

    const onCloseButtonClick = () => {
      document.removeEventListener(`keydown`, onPopupEscPress);
      aboutFilmPopupComponent.getElement().remove();
      aboutFilmPopupComponent.removeElement();
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

// показать кол-во фильмов в футере
const siteFooterStatisticsElement = document.querySelector(`.footer__statistics`);
siteFooterStatisticsElement.querySelector(`p`).textContent = `${MOVIE_COUNT} movies inside`;

// показать еще карточки с фильмами
let moviesLeft = MOVIE_COUNT - CARD_COUNT;

const onAutoLoad = () => {
  if (moviesLeft <= 0) {
    showMoreButtonComponent.getElement().remove();
    showMoreButtonComponent.removeElement();
    showMoreButtonComponent.getElement().removeEventListener(`click`, onLoadCardsButtonClick);
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

showMoreButtonComponent.getElement().addEventListener(`click`, onLoadCardsButtonClick);
