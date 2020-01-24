import {FilterType} from '../const.js';
// import {PEOPLE_NAMES} from '../mock/comment.js';
// import {getRandomNumber} from '../utils/utils.js';


export const getMoviesByFilter = (movies, checkedFilter) => {
  switch (checkedFilter) {
    case FilterType.ALL:
      return movies;
    case FilterType.WATCHLIST:
      return movies.filter((it) => (it.isWatchlist));
    case FilterType.HISTORY:
      return movies.filter((it) => it.isHistory);
    case FilterType.FAVORITES:
      return movies.filter((it) => it.isFavorites);
  }
  return movies;
};

const getMatchByFilter = (movie, filter) => {
  switch (filter) {
    case FilterType.WATCHLIST:
      return movie.isWatchlist;
    case FilterType.HISTORY:
      return movie.isHistory;
    case FilterType.FAVORITES:
      return movie.isFavorites;
  }
  return false;
};

let movieIdToCommentsMap = new Map();
const setMovieIdToComments = (movieId, movieComments) => {
  return movieIdToCommentsMap.set(movieId, movieComments);
};

export default class Movies {
  constructor() {
    this._movies = [];
    this._comments = new Map();
    this._currentFilter = FilterType.ALL;
    this._handlerFilterChanged = null;
    this._handlerDataChanged = null;
  }

  getMoviesAll() {
    return this._movies;
  }

  getComments(movieId) {
    return this._comments.get(movieId);
  }

  getMovies() {
    return getMoviesByFilter(this._movies, this._currentFilter);
  }

  matchCurrentFilter(card) {
    return getMatchByFilter(card, this._currentFilter);
  }

  setMovies(movies) {
    this._movies = Array.from(movies);
  }

  setComments(movieId, comments) {
    this._comments = setMovieIdToComments(movieId, comments);
  }

  setFilter(currentFilter) {
    this._currentFilter = currentFilter;
    this._handlerFilterChanged(this._currentFilter);
  }

  setFilterChangedHandler(handler) {
    this._handlerFilterChanged = handler;
  }

  setDataChangedHandler(handler) {
    this._handlerDataChanged = handler;
  }

  updateMovie(id, movie) {
    const index = this._movies.findIndex((it) => it.id === id);
    if (index === -1) {
      return false;
    }

    const copyMovies = this._movies.slice();
    copyMovies.splice(index, 1, movie);
    this._movies = copyMovies;
    this._handlerDataChanged();
    return true;
  }

  removeComment(idCard, idComment) {
    const copyMovies = this._movies.slice();
    const movie = copyMovies.find((it) => it.id === idCard);
    const i = movie.comments.findIndex((item) => item === idComment);
    if (i === -1) {
      return false;
    }
    movie.comments.splice(i, 1);

    this._movies = copyMovies;
    const index = this._comments.get(idCard).findIndex((item) => item.id === idComment);
    if (index === -1) {
      return false;
    }
    const copyComments = new Map(this._comments);
    copyComments.get(idCard).splice(index, 1);
    this._comments = copyComments;
    return true;
  }

  // addComment(idCard, newComment) {
  //   newComment.id = String(new Date().valueOf() + Math.random());
  //   newComment.autorComment = PEOPLE_NAMES[getRandomNumber(PEOPLE_NAMES.length)];
  //   const copyMovies = this._movies.slice();
  //   const movie = copyMovies.find((it) => it.id === idCard);
  //   movie.comments.push(newComment.id);
  //   this._movies = copyMovies;

  //   const copyComments = new Map(this._comments);
  //   copyComments.get(idCard).push(newComment);
  //   this._comments = copyComments;
  //   return true;
  // }
}
