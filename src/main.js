import ProfileUserComponent from './components/profile-user.js';
import MainNavigationComponent from './components/main-navigation.js';
import SortFilmComponent from './components/sort.js';

import {generateMovieCards} from './mock/movie.js';

import {generateMovieFilters} from './mock/filters.js';

import {MOVIE_COUNT} from './const.js';

import {render, RenderPosition} from './utils/render.js';
import PageController from './controllers/page.js';

const movieCards = generateMovieCards(MOVIE_COUNT);
const movieFilters = generateMovieFilters(movieCards);

const siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, new ProfileUserComponent(movieFilters[1].count), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector(`.main`);

render(siteMainElement, new MainNavigationComponent(movieFilters), RenderPosition.BEFOREEND);
render(siteMainElement, new SortFilmComponent(), RenderPosition.BEFOREEND);

const pageController = new PageController(siteMainElement);
pageController.render(movieCards);

// показать кол-во фильмов в футере
const siteFooterStatisticsElement = document.querySelector(`.footer__statistics`);
siteFooterStatisticsElement.querySelector(`p`).textContent = `${MOVIE_COUNT} movies inside`;
