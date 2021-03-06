import AbstractComponent from './abstract-component.js';

// функция возвращающая Список карточек с фильмами
const createListFilmCardsTemplate = () => {
  return (
    `<section class="films">
      <section class="films-list">
        <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
        <div class="films-list__container"> </div>
      </section>
      <section class="films-list--extra">
        <h2 class="films-list__title">Top rated</h2>
        <div class="films-list__container"></div>
      </section>
      <section class="films-list--extra">
        <h2 class="films-list__title">Most commented</h2>
       <div class="films-list__container"></div>
      </section>
    </section>`
  );
};

export default class ListFilmCards extends AbstractComponent {
  getTemplate() {
    return createListFilmCardsTemplate();
  }
}
