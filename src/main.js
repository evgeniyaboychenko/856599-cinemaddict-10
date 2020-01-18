import ProfileUserComponent from './components/profile-user.js';

import {generateMovieCards} from './mock/movie.js';
import {generateComments} from './mock/comment.js';

import {generateMovieFilters} from './mock/filters.js';

import {MOVIE_COUNT} from './const.js';

import {render, RenderPosition} from './utils/render.js';
import PageController from './controllers/page.js';
import FilterController from './controllers/filter.js';

import MoviesModel from './models/movies.js';

const getIdComments = (comments) => {
  return comments.map((comment) => {
    return comment.id;
  });
};

let movieIdToCommentsMap = new Map();
const generateCommentsForMovies = (cards) => {
  cards.forEach((item) => {
    const movieComments = generateComments();
    item.comments = (getIdComments(movieComments));
    movieIdToCommentsMap.set(item.id, movieComments);
  });
};

const movieCards = generateMovieCards(MOVIE_COUNT);
generateCommentsForMovies(movieCards);

const movieFilters = generateMovieFilters(movieCards);

const siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, new ProfileUserComponent(movieFilters[1].count), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector(`.main`);

const moviesModel = new MoviesModel();
moviesModel.setMovies(movieCards, movieIdToCommentsMap);

const filterController = new FilterController(siteMainElement, moviesModel);
filterController.render();

const pageController = new PageController(siteMainElement, moviesModel);
pageController.render();

// показать кол-во фильмов в футере
const siteFooterStatisticsElement = document.querySelector(`.footer__statistics`);
siteFooterStatisticsElement.querySelector(`p`).textContent = `${MOVIE_COUNT} movies inside`;
