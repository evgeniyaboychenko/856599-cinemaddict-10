import {render, RenderPosition, removeComponent, replace} from '../utils/render.js';
import MainNavigationComponent from '../components/main-navigation.js';
import {FilterType} from '../const.js';

//const FILTER_NAMES = [`All movies`, `Watchlist`, `History`, `Favorites`];

export const getMoviesByFilter = (movies, checkedFilter) => {
  switch (checkedFilter) {
    case FilterType.ALL:
      return movies;
    case FilterType.WATCHLIST:
      return movies.filter(it => it.isWatchlist);
    case FilterType.HISTORY:
      return movies.filter(it => it.isHistory);
    case FilterType.FAVORITES:
      return movies.filter(it => it.isFavorites);
  }
  return movies;
}

const generateMovieFilters = (films, checkedFilter) => {
    return Object.values(FilterType).map((it, index) => {
      return {
        name: it,
        count: index === 0 ? films.length : getMoviesByFilter(films, it).length,
        checked: it === checkedFilter,
      };
    });
};



export default class FilterController {
  constructor(container, movies) {
    this._container = container;
    this._movies = movies;
    this._activeFilterType = FilterType.ALL;

    this._onFilterButtonClick = this._onFilterButtonClick.bind(this);

  }



  render() {
    const movies = this._movies.getMovies();
    const filters = generateMovieFilters(movies, this._activeFilterType);

    this._mainNavigationComponent = new MainNavigationComponent(filters);
    render(this._container, this._mainNavigationComponent, RenderPosition.BEFOREEND);



    this._mainNavigationComponent.setFilterButtonClick(this._onFilterButtonClick);

  }
  _onFilterButtonClick(filterrr) {
    console.log(filterrr);
    }

}
