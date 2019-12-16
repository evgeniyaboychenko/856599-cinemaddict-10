const FILTER_NAMES = [`All movies`, `Watchlist`, `History`, `Favorites`];
const getCountFilter = (array, field) => {
  let i = 0;
  array.forEach((item) => {
    if (item[field]) {
      i++;
    }
  });
  return i;
};

export const generateMovieFilters = (films) => {
  if (films) {
    return FILTER_NAMES.map((it, index) => {
      return {
        name: it,
        count: index === 0 ? films.length : getCountFilter(films, `is${it}`),
      };
    });
  } else {
    return FILTER_NAMES.map((it) => {
      return {
        name: it,
        count: 0,
      };
    });

  }
};

