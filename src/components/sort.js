// import {createElement} from '../utils.js';
import AbstractComponent from './abstract-component.js';

const createSortFilmTemplate = () => {
  return (
    `<ul class="sort">
       <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
       <li><a href="#" class="sort__button">Sort by date</a></li>
       <li><a href="#" class="sort__button">Sort by rating</a></li>
    </ul>`
  );
};

// export default class SortFilmComponent {
//   constructor() {
//     this._element = null;
//   }

//   getTemplate() {
//     return createSortFilmTemplate();
//   }

//   getElement() {
//     if (!this._element) {
//       this._element = createElement(this.getTemplate());
//     }

//     return this._element;
//   }

//   removeElement() {
//     this._element = null;
//   }
// }

export default class MainNavigation extends AbstractComponent {
  getTemplate() {
    return createSortFilmTemplate();
  }
}
