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

export default class NoDataFilm extends AbstractComponent {
  getTemplate() {
    return createNoDataFilmTemplate();
  }
}
