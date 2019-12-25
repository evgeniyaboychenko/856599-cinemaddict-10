// import {createElement} from '../utils.js';
import AbstractComponent from './abstract-component.js';

// функция возвращающая кнопку Show More
const createShowMoreButtonTemplate = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

// export default class ShowMoreButtonComponent {
//   constructor() {
//     this._element = null;
//   }

//   getTemplate() {
//     return createShowMoreButtonTemplate();
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


export default class ShowMoreButton extends AbstractComponent {
  getTemplate() {
    return createShowMoreButtonTemplate();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
