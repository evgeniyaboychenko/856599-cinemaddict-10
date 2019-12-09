const createFilterMarkup = (filter) => {
  const {name, count} = filter;
  return name === `All movies` ? `<a href="#all" class="main-navigation__item main-navigation__item--active">${name}</a>` : `<a href="#watchlist" class="main-navigation__item">${name} <span class="main-navigation__item-count">${count}</span></a>`;
};

// функция возвращающая Меню
export const createMainNavigationTemplate = (filters) => {
  const filterMarkup = filters.map((it) => createFilterMarkup(it)).join(`\n`);
  return (
    `<nav class="main-navigation">
${filterMarkup}
    <!--<a href="#all" class="main-navigation__item main-navigation__item&#45;&#45;active">All movies</a>-->
    <!--<a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">13</span></a>-->
    <!--<a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">4</span></a>-->
    <!--<a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">8</span></a>-->
    <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
  </nav>`
  );
};
