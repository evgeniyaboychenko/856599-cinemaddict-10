import {createProfileUserTemplate} from './components/profile-user.js';
import {createMainNavigationTemplate} from './components/main-navigation.js';
import {createListFilmCardsTemplate} from './components/list-film-cards.js';
import {createShowMoreButtonTemplate} from './components/show-more-button.js';
import {createFilmCardTemplate} from './components/film-card.js';
import {createAboutFilmPopupTemplate} from './components/about-film.js';

import {generateMovieCard} from './mock/movie.js';

const CARD_COUNT = 5;
const CARD_COUNT_EXTRA = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);
render(siteHeaderElement, createProfileUserTemplate(), `beforeend`);

const siteMainElement = document.querySelector(`.main`);
render(siteMainElement, createMainNavigationTemplate(), `beforeend`);
render(siteMainElement, createListFilmCardsTemplate(), `beforeend`);

const siteFilmsElement = siteMainElement.querySelector(`.films`);
render(siteFilmsElement, createShowMoreButtonTemplate(), `beforeend`);

const siteFilmsListContainerElements = siteFilmsElement.querySelectorAll(`.films-list__container`);

const renderCard = (countCard, container) => {
  for (let i = 0; i < countCard; i++) {
    render(container, createFilmCardTemplate(), `beforeend`);
  }
};

renderCard(CARD_COUNT, siteFilmsListContainerElements[0]);
for (let i = 1; i < 3; i++) {
  renderCard(CARD_COUNT_EXTRA, siteFilmsListContainerElements[i]);
}

const siteBody = document.querySelector(`body`);
render(siteBody, createAboutFilmPopupTemplate(generateMovieCard()), `beforeend`);
