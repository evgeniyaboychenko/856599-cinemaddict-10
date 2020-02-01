import ListFilmCardsComponent from '../components/list-film-cards.js';
import ShowMoreButtonComponent from '../components/show-more-button.js';
import NoDataFilmComponent from '../components/no-data_film.js';
import SortFilmComponent, {SortType} from '../components/sort.js';
import {CARD_COUNT, CARD_COUNT_TOP} from '../const.js';
import {generateRandomItems} from '../utils/utils.js';
import {render, RenderPosition, removeComponent} from '../utils/render.js';
import MovieController, {OperationType} from './movie.js';
import moment from 'moment';

const isTopRatedMovieShowing = (cards) => {
  return cards.some((card) => card.rating > 0);
};
const isTopCommentedMovieShowing = (cards) => {
  return cards.some((card) => card.comments.length > 0);
};

const filterCardsByValue = (cards, i, getValue) => {
  return cards.filter((item) => getValue(cards[i]) === getValue(item));
};

const getTopMovies = (cards, getValue) => {
  const sortedCards = cards.slice().sort((a, b) => {
    return getValue(b) - getValue(a);
  });
  const topCards = filterCardsByValue(sortedCards, 0, getValue);
  if (topCards.length >= CARD_COUNT_TOP) {
    return generateRandomItems(topCards, CARD_COUNT_TOP);
  }
  const nextTopCards = filterCardsByValue(sortedCards, 1, getValue);
  return getValue(nextTopCards[0]) !== 0 ? topCards.concat(generateRandomItems(nextTopCards, 1)) : topCards;
};

const getTopCommentedMovies = (cards) => {
  return getTopMovies(cards, (card) => card.comments.length);
};

const getTopRatedMovies = (cards) => {
  return getTopMovies(cards, (card) => card.rating);
};

const getCardShowing = (cards, start, count) => {
  return cards.slice(start, start + count);
};

export default class PageController {
  constructor(container, moviesModel, api) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._api = api;
    this._onFilterChange = this._onFilterChange.bind(this);
    this._moviesModel.setFilterChangedHandler(this._onFilterChange);
    this._sortFilmComponent = new SortFilmComponent();
    this._onSortChange = this._onSortChange.bind(this);
    this._sortFilmComponent.setSortTypeChangeHandler(this._onSortChange);
    this._listFilmCardsComponent = new ListFilmCardsComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._noDataFilmComponent = new NoDataFilmComponent();
    this._onViewChange = this._onViewChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onCommentDataChange = this._onCommentDataChange.bind(this);
    this._loadComments = this._loadComments.bind(this);
    this._movieControllers = [];
    this._movieTopRatedControllers = [];
    this._topRatedMoviesModel = [];
    this._movieTopCommentedControllers = [];
    this._topCommentedMoviesModel = [];
    this._siteFilmsListContainerElements = null;
    this._currenSortType = SortType.DEFAULT;
  }

  render() {
    const movies = this._getSortMovies(this._currenSortType, this._moviesModel.getMovies());
    const drawMovieCards = () => {
      render(this._container, this._sortFilmComponent, RenderPosition.BEFOREEND);
      render(this._container, this._listFilmCardsComponent, RenderPosition.BEFOREEND);
      this._siteFilmsListContainerElements = this._listFilmCardsComponent.getElement().querySelectorAll(`.films-list__container`);
      this._renderCard(getCardShowing(movies, 0, CARD_COUNT), this._siteFilmsListContainerElements[0], this._onDataChange, this._onViewChange, this._onCommentDataChange);
      this._renderTopRatedMovie();
      this._renderMostCommentedMovie();
      this._renderShowMoreButton();
    };

    const drawMessageNoFilms = () => {
      // показать сообщение, что фильмов нет
      render(this._container, this._noDataFilmComponent, RenderPosition.BEFOREEND);
    };

    if (movies.length) {
      drawMovieCards();
    } else {
      drawMessageNoFilms();
    }
  }

  show() {
    this._listFilmCardsComponent.show();
    this._sortFilmComponent.show();
  }

  hide() {
    this._listFilmCardsComponent.hide();
    this._sortFilmComponent.hide();
  }

  _getSameControllers(controllers, moviesModel, topControllers, idCard) {
    const index = moviesModel.findIndex((it) => it.id === idCard);
    if (index > -1) {
      controllers.push(topControllers[index]);
    }
  }

  _getSameMovieControllers(movieController, idCard) {
    const sameMovieControllers = [];
    if (this._movieControllers.includes(movieController)) {
      sameMovieControllers.push(movieController);
      this._getSameControllers(sameMovieControllers, this._topRatedMoviesModel, this._movieTopRatedControllers, idCard);
      this._getSameControllers(sameMovieControllers, this._topCommentedMoviesModel, this._movieTopCommentedControllers, idCard);
    } else {
      this._getSameControllers(sameMovieControllers, this._topRatedMoviesModel, this._movieTopRatedControllers, idCard);
      this._getSameControllers(sameMovieControllers, this._topCommentedMoviesModel, this._movieTopCommentedControllers, idCard);
      this._getSortMovies(this._currenSortType, this._moviesModel.getMovies()).forEach((it, i) => {
        if (it.id === idCard) {
          if (i < this._movieControllers.length) {
            sameMovieControllers.push(this._movieControllers[i]);
          }
        }
      });
    }
    return sameMovieControllers;
  }

  _getSortMovies(sortType, sortMovies) {
    switch (sortType) {
      case SortType.DATE:
        return (sortMovies.slice().sort((a, b) => {
          return moment(b.releaseDate) - moment(a.releaseDate);
        }));
      case SortType.RATING:
        return (sortMovies.slice().sort((a, b) => {
          return b.rating - a.rating;
        }));
      case SortType.DEFAULT:
        return sortMovies;
    }
    return sortMovies;
  }

  _removeMovies() {
    this._movieControllers.forEach((movieController) => movieController.destroy());
    this._movieControllers = [];
  }

  _onFilterChange() {
    this._currenSortType = SortType.DEFAULT;
    this._sortFilmComponent.setDefaultSort();
    this._removeMovies();
    this._renderCard(getCardShowing(this._getSortMovies(this._currenSortType, this._moviesModel.getMovies()), 0, CARD_COUNT), this._siteFilmsListContainerElements[0], this._onDataChange, this._onViewChange, this._onCommentDataChange);
    this._renderShowMoreButton();
  }

  _onViewChange() {
    this._movieControllers.forEach((item) => {
      item.setDefaultView();
    });
  }

  _onCommentDataChange(movieController, idCard, oldIdComment, newComment) {
    const sameMovieControllers = this._getSameMovieControllers(movieController, idCard);
    if (!newComment) {
      this._api.deleteComment(oldIdComment)
      .then(() => {
        const isSuccess = this._moviesModel.removeComment(idCard, oldIdComment);
        if (isSuccess) {
          const newData = this._moviesModel.getMoviesAll().find((item) => item.id === idCard);
          sameMovieControllers.forEach((controller) => controller.render(newData, this._loadComments));
          this._renderMostCommentedMovie();
        }
      })
      .catch(() => {
        movieController.shake(OperationType.DELETE_COMMENT, oldIdComment);
      });
    } else {
      this._api.createComment(idCard, newComment)
      .then((data) => {
        const {movie, comments} = data;
        this._moviesModel.setComments(idCard, comments);
        const isSuccess = this._moviesModel.updateMovie(idCard, movie);
        if (isSuccess) {
          sameMovieControllers.forEach((controller) => controller.render(movie, this._loadComments));
          this._renderMostCommentedMovie();
        }
      })
      .catch(() => {
        movieController.shake(OperationType.CREATE_COMMENT);
      });
    }
  }

  _onDataChange(movieController, oldData, newData) {
    const allCardCount = this._moviesModel.getMovies().length;
    const sameMovieControllers = this._getSameMovieControllers(movieController, oldData.id);
    this._api.updateMovie(oldData.id, newData)
    .then((movieModel) => {
      const isSuccess = this._moviesModel.updateMovie(oldData.id, movieModel);
      if (isSuccess) {
        sameMovieControllers.forEach((controller) => controller.render(movieModel, this._loadComments));
        if (oldData.rating !== movieModel.rating) {
          this._renderTopRatedMovie();
        }
      }
      if (this._moviesModel.matchCurrentFilter(oldData) !== this._moviesModel.matchCurrentFilter(movieModel)) {
        if (this._moviesModel.matchCurrentFilter(oldData)) {
          const showedCardsCount = this._movieControllers.length;
          this._removeMovies();
          this._renderCard(getCardShowing(this._getSortMovies(this._currenSortType, this._moviesModel.getMovies()), 0, showedCardsCount), this._siteFilmsListContainerElements[0], this._onDataChange, this._onViewChange, this._onCommentDataChange);
          this._renderShowMoreButton();
        } else {
          const showedCardsCount = this._movieControllers.length;
          this._removeMovies();
          if (showedCardsCount === allCardCount) {
            this._renderCard(getCardShowing(this._getSortMovies(this._currenSortType, this._moviesModel.getMovies()), 0, showedCardsCount + 1), this._siteFilmsListContainerElements[0], this._onDataChange, this._onViewChange, this._onCommentDataChange);
          } else {
            this._renderCard(getCardShowing(this._getSortMovies(this._currenSortType, this._moviesModel.getMovies()), 0, showedCardsCount), this._siteFilmsListContainerElements[0], this._onDataChange, this._onViewChange, this._onCommentDataChange);
          }
          this._renderShowMoreButton();
        }
      }
    })
    .catch(() => {
      movieController.shake(OperationType.SET_USER_RATING);
    });
  }

  _loadComments(card) {
    const comments = this._moviesModel.getComments(card.id);
    if (comments) {
      return Promise.resolve(comments);
    }
    return this._api.getComments(card.id)
    .then((commentsForMovie) => {
      this._moviesModel.setComments(card.id, commentsForMovie);
      return this._moviesModel.getComments(card.id);
    });
  }

  _renderCard(cards, container, onDataChange, onViewChange, onDataCommentChange) {
    cards.forEach((card) => {
      const movieController = new MovieController(container, onDataChange, onViewChange, onDataCommentChange);
      movieController.render(card, this._loadComments);
      this._movieControllers.push(movieController);
    });
  }

  _renderTopRatedMovie() {
    const movies = this._getSortMovies(this._currenSortType, this._moviesModel.getMovies());
    const siteFilmListContainerExtraElements = this._listFilmCardsComponent.getElement().querySelectorAll(`.films-list--extra`);
    if (isTopRatedMovieShowing(movies)) {
      this._renderCardTopRated(getTopRatedMovies(movies), this._siteFilmsListContainerElements[1], this._onDataChange, this._onViewChange, this._onCommentDataChange);
      if (siteFilmListContainerExtraElements[0].classList.contains(`visually-hidden`)) {
        siteFilmListContainerExtraElements[0].classList.remove(`visually-hidden`);
      }
    } else {
      siteFilmListContainerExtraElements[0].classList.add(`visually-hidden`);
    }
  }

  _renderMostCommentedMovie() {
    const movies = this._getSortMovies(this._currenSortType, this._moviesModel.getMoviesAll());
    const siteFilmListContainerExtraElements = this._listFilmCardsComponent.getElement().querySelectorAll(`.films-list--extra`);
    if (isTopCommentedMovieShowing(movies)) {
      this._renderCardTopCommented(getTopCommentedMovies(movies), this._siteFilmsListContainerElements[2], this._onDataChange, this._onViewChange, this._onCommentDataChange);
      if (siteFilmListContainerExtraElements[1].classList.contains(`visually-hidden`)) {
        siteFilmListContainerExtraElements[1].classList.remove(`visually-hidden`);
      }
    } else {
      siteFilmListContainerExtraElements[1].classList.add(`visually-hidden`);
    }
  }

  _renderCardTopRated(cards, container, onDataChange, onViewChange, onDataCommentChange) {
    const oldTopRatedMoviesModel = this._topRatedMoviesModel;
    const oldMovieTopRatedControllers = this._movieTopRatedControllers;
    this._topRatedMoviesModel = [];
    this._movieTopRatedControllers = [];
    cards.forEach((card, index) => {
      const oldCardTopRated = oldTopRatedMoviesModel[index];
      if (oldCardTopRated && (card.id === oldCardTopRated.id)) {
        this._topRatedMoviesModel.push(card);
        this._movieTopRatedControllers.push(oldMovieTopRatedControllers[index]);
      } else {
        if (oldCardTopRated) {
          oldMovieTopRatedControllers[index].destroy();
        }
        const movieController = new MovieController(container, onDataChange, onViewChange, onDataCommentChange);
        movieController.render(card, this._loadComments);
        this._topRatedMoviesModel.push(card);
        this._movieTopRatedControllers.push(movieController);
      }
    });
  }

  _renderCardTopCommented(cards, container, onDataChange, onViewChange, onDataCommentChange) {
    const oldTopCommentedMoviesModel = this._topCommentedMoviesModel;
    const oldMovieTopCommentedControllers = this._movieTopCommentedControllers;
    this._topCommentedMoviesModel = [];
    this._movieTopCommentedControllers = [];
    cards.forEach((card, index) => {
      const oldCardTopCommented = oldTopCommentedMoviesModel[index];
      if (oldCardTopCommented && card.id === oldCardTopCommented.id) {
        this._topCommentedMoviesModel.push(card);
        this._movieTopCommentedControllers.push(oldMovieTopCommentedControllers[index]);
      } else {
        if (oldCardTopCommented) {
          oldMovieTopCommentedControllers[index].destroy();
        }
        const movieController = new MovieController(container, onDataChange, onViewChange, onDataCommentChange);
        movieController.render(card, this._loadComments);
        this._topCommentedMoviesModel.push(card);
        this._movieTopCommentedControllers.push(movieController);
      }
    });
  }

  _renderShowMoreButton() {
    const movieCards = this._getSortMovies(this._currenSortType, this._moviesModel.getMovies());
    removeComponent(this._showMoreButtonComponent);
    const siteFilmsList = this._listFilmCardsComponent.getElement().querySelector(`.films-list`);
    render(siteFilmsList, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
    const showedCardsCount = this._movieControllers.length;
    let moviesLeft = movieCards.length - showedCardsCount;
    const onAutoLoad = () => {
      if (moviesLeft <= 0) {
        removeComponent(this._showMoreButtonComponent);
      }
    };

    onAutoLoad();
    let start = 0;

    const onLoadCardsButtonClick = () => {
      const counter = Math.min(CARD_COUNT, moviesLeft);
      start = start + CARD_COUNT;
      this._renderCard(getCardShowing(this._getSortMovies(this._currenSortType, this._moviesModel.getMovies()), start, counter), this._siteFilmsListContainerElements[0], this._onDataChange, this._onViewChange, this._onCommentDataChange);
      moviesLeft = moviesLeft - CARD_COUNT;
      onAutoLoad();
    };
    this._showMoreButtonComponent.setClickHandler(onLoadCardsButtonClick);
  }

  _onSortChange(sortType) {
    this._currenSortType = sortType;
    const sortMovies = this._getSortMovies(this._currenSortType, this._moviesModel.getMovies());
    const showedCardsCount = this._movieControllers.length;
    this._removeMovies();
    this._renderCard(getCardShowing(sortMovies, 0, showedCardsCount), this._siteFilmsListContainerElements[0], this._onDataChange, this._onViewChange, this._onCommentDataChange);
    this._renderShowMoreButton();
  }
}
