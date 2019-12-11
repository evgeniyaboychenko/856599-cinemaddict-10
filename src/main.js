//import {createProfileUserTemplate} from './components/profile-user.js';
// import {createMainNavigationTemplate} from './components/main-navigation.js';
// import {createListFilmCardsTemplate} from './components/list-film-cards.js';
//import {createShowMoreButtonTemplate} from './components/show-more-button.js';
// import {createFilmCardTemplate} from './components/film-card.js';
//mport {createAboutFilmPopupTemplate} from './components/about-film.js';
//import {createSortFilmTemplate} from './components/sort.js';



import ProfileUserComponent from './components/profile-user.js';
import MainNavigationComponent from './components/main-navigation.js';
import SortFilmComponent from './components/sort.js';
import ListFilmCardsComponent from './components/list-film-cards.js';
import ShowMoreButtonComponent from './components/show-more-button.js';
import FilmCardComponent from './components/film-card.js';
import AboutFilmPopupComponent from './components/about-film.js';

import {generateMovieCard} from './mock/movie.js';

import {generateMovieCards} from './mock/movie.js';
import {generateMovieComments} from './mock/comment.js';

import {generateMovieFilters} from './mock/filters.js';

import {CARD_COUNT, MOVIE_COUNT} from './const.js';

import {generateRandomArray} from './utils.js';

import {render, RenderPosition} from './utils.js';

const movieCards = generateMovieCards(MOVIE_COUNT);
const movieFilters = generateMovieFilters(movieCards);

const renderold = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);
//renderold(siteHeaderElement, createProfileUserTemplate(movieFilters[1].count), `beforeend`);
render(siteHeaderElement, new ProfileUserComponent(movieFilters[1].count).getElement(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector(`.main`);

//renderold(siteMainElement, createMainNavigationTemplate(movieFilters), `beforeend`);
render(siteMainElement, new MainNavigationComponent(movieFilters).getElement(), RenderPosition.BEFOREEND);
//renderold(siteMainElement, createSortFilmTemplate(), `beforeend`);
render(siteMainElement, new SortFilmComponent().getElement(), RenderPosition.BEFOREEND);
//renderold(siteMainElement, createListFilmCardsTemplate(), `beforeend`);
render(siteMainElement, new ListFilmCardsComponent().getElement(), RenderPosition.BEFOREEND);

const siteFilmsElement = siteMainElement.querySelector(`.films`);
//renderold(siteFilmsElement, createShowMoreButtonTemplate(), `beforeend`);

render(siteFilmsElement, new ShowMoreButtonComponent().getElement(), RenderPosition.BEFOREEND);


const siteFilmsListContainerElements = siteFilmsElement.querySelectorAll(`.films-list__container`);
const siteFilmListContainerExtraElements = siteFilmsElement.querySelectorAll(`.films-list--extra`);

const getCardShowing = (cards, start, count) => {
  return cards.slice(start, start + count);
};

const renderCard = (cards, container) => {
 // cards.forEach((item) => renderold(container, createFilmCardTemplate(item), `beforeend`));
  cards.forEach((card) => render(container, new FilmCardComponent(card).getElement(), RenderPosition.BEFOREEND));
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
  if (maxElementArray.length >= 2) {
    return generateRandomArray(maxElementArray, 2);
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

const siteBody = document.querySelector(`body`);
const movieCard = generateMovieCard();
// renderold(siteBody, createAboutFilmPopupTemplate(movieCard, generateMovieComments(movieCard.commentsCount)), `beforeend`);
render(siteBody, new AboutFilmPopupComponent(movieCard, generateMovieComments(movieCard.commentsCount)).getElement(), RenderPosition.BEFOREEND);
//AboutFilmPopupComponent.getElement().remove();

// показать кол-во фильмов в футере
const siteFooterStatisticsElement = document.querySelector(`.footer__statistics`);
siteFooterStatisticsElement.querySelector(`p`).textContent = `${MOVIE_COUNT} movies inside`;

// показать еще карточки с фильмами
const buttonShowMore = siteFilmsElement.querySelector(`.films-list__show-more`);
let moviesLeft = MOVIE_COUNT - CARD_COUNT;

const onAutoLoad = () => {
  if (moviesLeft <= 0) {
    buttonShowMore.classList.add(`visually-hidden`);
    buttonShowMore.removeEventListener(`click`, onLoadCardsButtonClick);
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

buttonShowMore.addEventListener(`click`, onLoadCardsButtonClick);
