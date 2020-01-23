import AbstractComponent from './abstract-component.js';
import {FilterType} from '../const.js';


const createFilterMarkup = (filter) => {
  const {name, count} = filter;
  return name === `All movies` ? `<a href="#all" data-filter-type="${FilterType.ALL}" class="main-navigation__item main-navigation__item--active">${name}</a>` : `<a href="#${name.toLowerCase()}" data-filter-type="${name}" class="main-navigation__item">${name} <span class="main-navigation__item-count">${count}</span></a>`;
};

// функция возвращающая Меню
const createMainNavigationTemplate = (filters) => {
  const filterMarkup = filters.map((it) => createFilterMarkup(it)).join(`\n`);
  return (
    `<nav class="main-navigation">
${filterMarkup}
    <a href="#stats" data-filter-type="Stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
  </nav>`
  );
};

export default class MainNavigation extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
    this._currentFilterType = FilterType.ALL;
  }

  setCurrentFilter(currentFiter) {
    this._currentFilterType = currentFiter;
    this.getElement().querySelectorAll(`.main-navigation__item`).forEach((item) => {
      if (item.classList.contains(`main-navigation__item--active`)) {
        item.classList.remove(`main-navigation__item--active`);
      }
    });
    this.getElement().querySelector(`a[data-filter-type="${currentFiter}"]`).classList.add(`main-navigation__item--active`);
  }

  getTemplate() {
    return createMainNavigationTemplate(this._filters);
  }

  setFilterChangedHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const filterType = evt.target.dataset.filterType;

      if (this._currentFilterType === filterType) {
        return;
      }

      this._currentFilterType = filterType;

      this.getElement().querySelectorAll(`.main-navigation__item`).forEach((item) => {
        if (item.classList.contains(`main-navigation__item--active`)) {
          item.classList.remove(`main-navigation__item--active`);
        }
      });
      evt.target.classList.add(`main-navigation__item--active`);

      handler(this._currentFilterType);
    });
  }
}
