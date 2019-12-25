// import {createElement} from '../utils.js';
import AbstractComponent from './abstract-component.js';

// функция возвращающая сообщение, что нет фильмов
const createNoDataFilmTemplate = () => {
  return (
    `<section class="films">
      <section class="films-list">
        <h2 class="films-list__title">There are no movies in our database</h2>
    </section>
  </section>`
  );
};

// export default class NoDataFilmComponent {
//   constructor() {
//     this._element = null;
//   }

//   getTemplate() {
//     return createNoDataFilmTemplate();
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

export default class NoDataFilm extends AbstractComponent {
  getTemplate() {
    return createNoDataFilmTemplate();
  }
}
