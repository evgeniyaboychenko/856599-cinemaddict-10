import API from './api.js';
import ProfileUserComponent from './components/profile-user.js';
import StatisticComponent from './components/statistic.js';
import MessageLoadingComponent from './components/message-loading.js';

import {render, RenderPosition, removeComponent} from './utils/render.js';
import PageController from './controllers/page.js';
import FilterController from './controllers/filter.js';
import MoviesModel from './models/movies.js';

const AUTHORIZATION = `Basic eo0w590i629889a`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;
const api = new API(END_POINT, AUTHORIZATION);

const showProfileUser = (moviesModel) => {
  const siteHeaderElement = document.querySelector(`.header`);
  const profileUserComponent = new ProfileUserComponent(moviesModel);
  render(siteHeaderElement, profileUserComponent, RenderPosition.BEFOREEND);
};

const siteMainElement = document.querySelector(`.main`);

const moviesModel = new MoviesModel();
const filterController = new FilterController(siteMainElement, moviesModel);
const pageController = new PageController(siteMainElement, moviesModel, api);
const statisticComponent = new StatisticComponent(moviesModel);
const messageLoadingComponent = new MessageLoadingComponent();
render(siteMainElement, messageLoadingComponent, RenderPosition.BEFOREEND);

// показать кол-во фильмов в футере
const showCountMovies = (movies) => {
  const siteFooterStatisticsElement = document.querySelector(`.footer__statistics`);
  siteFooterStatisticsElement.querySelector(`p`).textContent = `${movies.length} movies inside`;
};

api.getMovies()
  .then((movies) => {
    moviesModel.setMovies(movies);
    removeComponent(messageLoadingComponent);
    showProfileUser(moviesModel);
    filterController.render();
    pageController.render();
    render(siteMainElement, statisticComponent, RenderPosition.BEFOREEND);
    statisticComponent.hide();
    showCountMovies(movies);
  });

const onMenuChanged = (isActiveStats) => {
  if (isActiveStats) {
    statisticComponent.show();
    pageController.hide();
  } else {
    statisticComponent.hide();
    pageController.show();
  }
};

filterController.setOnMenuChanged(onMenuChanged);
