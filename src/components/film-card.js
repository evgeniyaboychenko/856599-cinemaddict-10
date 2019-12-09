// функция возвращающая Карточку фильма
const cropText = (text) => {
  return text.length > 140 ? `${text.substr(0, 139)}...` : text;
};

const generateDateRelease = (date) => {
  const year = date.getFullYear();
  return `${year}`;
};


export const createFilmCardTemplate = (film) => {
  const {posters, title, description, rating, releaseDate, runtime, genres, commentsCount} = film;
  const shortDescription = cropText(description);
  const releaseDateYear = generateDateRelease(releaseDate);
  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseDateYear}</span>
        <span class="film-card__duration">${runtime}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="./images/posters/${posters}" alt="" class="film-card__poster">
      <p class="film-card__description">${shortDescription}</p>
      <a class="film-card__comments">${commentsCount} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
      </form>
    </article>`
  );
};
