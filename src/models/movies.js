import {getMoviesByFilter} from '../controllers/filter.js';
import {FilterType} from '../const.js';

export default class Movies {
  constructor() {
    this._movies = [];
    this._currentFilter = FilterType.ALL;
  }
  getMovies() {
    return this._movies;
  }
  setMovies(movies) {
    this._movies = Array.from(movies);
  }

  getFiltredMovies() {
    return this._movies = getMoviesByFilter(this._movies, this._currentFilter);
  }

  setFiltredMovies(currentFilter) {
    this._currentFilter = currentFilter;
  }

  updateMovies(id, movie) {
    const index = this._movies.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    //this._tasks = [].concat(this._tasks.slice(0, index), task, this._tasks.slice(index + 1));

    const copyMovies = this._movies.slice();
    copyMovies.splice(index, 1, movie);
    this._movies = copyMovies;

    return true;
  }
}
