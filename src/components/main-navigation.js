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
    <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
  </nav>`
  );
};
