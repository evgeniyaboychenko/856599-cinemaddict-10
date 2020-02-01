import AbstractComponent from './abstract-component.js';

const SortType = {
  DEFAULT: `Sort by default`,
  DATE: `Sort by date`,
  RATING: `Sort by rating`
};

const createSortFilmTemplate = () => {
  return (
    `<ul class="sort">
       <li><a href="#" data-sort-type="${SortType.DEFAULT}" class="sort__button sort__button--active">${SortType.DEFAULT}</a></li>
       <li><a href="#" data-sort-type="${SortType.DATE}" class="sort__button">${SortType.DATE}</a></li>
       <li><a href="#" data-sort-type="${SortType.RATING}" class="sort__button">${SortType.RATING}</a></li>
    </ul>`
  );
};

export default class SortFilm extends AbstractComponent {
  constructor() {
    super();
    this._currenSortType = SortType.DEFAULT;
  }

  setDefaultSort() {
    this._currenSortType = SortType.DEFAULT;
    const sortButtons = this.getElement().querySelectorAll(`.sort__button`);
    sortButtons.forEach((item) => {
      if (item.classList.contains(`sort__button--active`)) {
        item.classList.remove(`sort__button--active`);
      }
    });
    this.getElement().querySelector(`a[data-sort-type="Sort by default"]`).classList.add(`sort__button--active`);
  }

  getTemplate() {
    return createSortFilmTemplate();
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currenSortType === sortType) {
        return;
      }

      this._currenSortType = sortType;
      this.getElement().querySelectorAll(`.sort__button`).forEach((item) => {
        if (item.classList.contains(`sort__button--active`)) {
          item.classList.remove(`sort__button--active`);
        }
      });
      evt.target.classList.add(`sort__button--active`);

      handler(this._currenSortType);
    });
  }
}

export {SortType};
