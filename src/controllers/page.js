import ListFilmCardsComponent from '../components/list-film-cards.js';
import ShowMoreButtonComponent from '../components/show-more-button.js';

import NoDataFilmComponent from '../components/no-data_film.js';
import SortFilmComponent, {SortType} from '../components/sort.js';

import {CARD_COUNT, MOVIE_COUNT, CARD_COUNT_TOP} from '../const.js';

import {generateRandomArray} from '../utils/utils.js';
import {render, RenderPosition, removeComponent} from '../utils/render.js';
import MovieController from './movie.js';

const sortFilmCards = (filmCards, field) => {
  return (filmCards.slice().sort((a, b) => {
    return b[field] - a[field];
  }));
};

// функция определяющая TOP
const isTopRatedMovieShowing = (cards, field) => {
  return cards.some((card) => card[field] > 0);
};
const isTopCommentedMovieShowing = (cards, field) => {
  return cards.some((card) => card[field].length > 0);
};

const getFilteredArray = (array, i, field) => {
  return array.filter((item) => array[i][field] === item[field]);
};

const getFilteredArrayByComment = (array, i, field) => {
  return array.filter((item) => array[i][field].length === item[field].length);
};

const getTopRatedMovie = (cards, field) => {
  let nextMaxElementArray = [];
  let array = cards.slice().sort((a, b) => {
    return b[field] - a[field];
  });
  let maxElementArray = getFilteredArray(array, 0, field);
  if (maxElementArray.length >= CARD_COUNT_TOP) {
    return generateRandomArray(maxElementArray, CARD_COUNT_TOP);
  } else {
    nextMaxElementArray = getFilteredArray(array, 1, field);
    return nextMaxElementArray[0][field] !== 0 ? maxElementArray.concat(generateRandomArray(nextMaxElementArray, 1)) : maxElementArray;
  }
};

const getTopCommentedMovie = (cards, field) => {
  let nextMaxElementArray = [];
  let array = cards.slice().sort((a, b) => {
    return b[field].length - a[field].length;
  });
  let maxElementArray = getFilteredArrayByComment(array, 0, field);
  if (maxElementArray.length >= CARD_COUNT_TOP) {
    return generateRandomArray(maxElementArray, CARD_COUNT_TOP);
  } else {
    nextMaxElementArray = getFilteredArrayByComment(array, 1, field);
    return nextMaxElementArray[0][field].length !== 0 ? maxElementArray.concat(generateRandomArray(nextMaxElementArray, 1)) : maxElementArray;
  }
};

const getCardShowing = (cards, start, count) => {
  return cards.slice(start, start + count);
};

export default class PageController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;

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

    this._movieControllers = [];
    this._movieTopControllers = [];
    this._topMoviesModel = [];

    this._siteFilmsListContainerElements = null;

    this._currentFilter = null;
    this._currenSortType = SortType.DEFAULT;
  }

  show() {
    this._listFilmCardsComponent.show();
    this._sortFilmComponent.show();
  }

  hide() {
    this._listFilmCardsComponent.hide();
    this._sortFilmComponent.hide();
  }


  _removeMovies() {
    this._movieControllers.forEach((movieController) => movieController.destroy());
    this._movieControllers = [];
  }

  _onFilterChange(filter) {
    this._currenSortType = SortType.DEFAULT;
    this._sortFilmComponent.setDefaultSort();
    this._removeMovies();
    this._renderCard(getCardShowing(this._getSortMovies(this._currenSortType, this._moviesModel.getMovies()), 0, CARD_COUNT), this._siteFilmsListContainerElements[0], this._onDataChange, this._onViewChange, this._onCommentDataChange);
    this._renderShowMoreButton();
    this._currentFilter = filter;
  }

  _onViewChange() {
    this._movieControllers.forEach((item) => {
      item.setDefaultView();
    });
  }

  _onCommentDataChange(movieController, idCard, oldIdComment, newComment) {
    const sameMovieControllers = [];

    if (this._movieControllers.includes(movieController)) {
      // если нажали в списке
      this._topMoviesModel.forEach((it, index) => {
        if (it.id === idCard) {
          sameMovieControllers.push(this._movieTopControllers[index]);
        }
      });
    } else {
      // если нажали в ТОПе
      this._topMoviesModel.forEach((it, index) => {
        if (it.id === idCard) {
          sameMovieControllers.push(this._movieTopControllers[index]);
        }
      });

      this._getSortMovies(this._currenSortType, this._moviesModel.getMovies()).forEach((it, index) => {
        if (it.id === idCard) {
          if (index < this._movieControllers.length) {
            sameMovieControllers.push(this._movieControllers[index]);
          }
        }
      });
    }
    if (!newComment) {
      const isSuccess = this._moviesModel.removeComment(idCard, oldIdComment);
      if (isSuccess) {
        const newData = this._moviesModel.getMoviesAll().find((item) => item.id === idCard);
        movieController.render(newData, this._moviesModel.getComments(newData.id));
        sameMovieControllers.forEach((controller) => controller.render(newData, this._moviesModel.getComments(newData.id)));
        this._renderMostCommentedMovie();
      }
    } else {
      const isSuccess = this._moviesModel.addComment(idCard, newComment);
      if (isSuccess) {
        const newData = this._moviesModel.getMoviesAll().find((item) => item.id === idCard);
        movieController.render(newData, this._moviesModel.getComments(newData.id));
        sameMovieControllers.forEach((controller) => controller.render(newData, this._moviesModel.getComments(newData.id)));
        this._renderMostCommentedMovie();
      }
    }
  }

  _onDataChange(movieController, oldData, newData) {
    const allCardCount = this._moviesModel.getMovies().length;
    const sameMovieControllers = [];

    if (this._movieControllers.includes(movieController)) {
      // если нажали в списке
      this._topMoviesModel.forEach((it, index) => {
        if (it.id === oldData.id) {
          sameMovieControllers.push(this._movieTopControllers[index]);
        }
      });
    } else {
      // если нажали в ТОПе
      this._topMoviesModel.forEach((it, index) => {
        if (it.id === oldData.id) {
          sameMovieControllers.push(this._movieTopControllers[index]);
        }
      });

      this._getSortMovies(this._currenSortType, this._moviesModel.getMovies()).forEach((it, index) => {
        if (it.id === oldData.id) {
          if (index < this._movieControllers.length) {
            sameMovieControllers.push(this._movieControllers[index]);
          }
        }
      });
    }

    const isSuccess = this._moviesModel.updateMovies(oldData.id, newData);
    if (isSuccess) {
      movieController.render(newData, this._moviesModel.getComments(newData.id));
      sameMovieControllers.forEach((controller) => controller.render(newData, this._moviesModel.getComments(newData.id)));
    }

    // снимаем фильтр у карточки в соответствующем списке фильтра
    if (this._moviesModel.matchCurrentFilter(oldData) !== this._moviesModel.matchCurrentFilter(newData)) {
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
  }

  _renderCard(cards, container, onDataChange, onViewChange, onDataCommentChange) {
    cards.forEach((card) => {
      const movieController = new MovieController(container, onDataChange, onViewChange, onDataCommentChange);
      movieController.render(card, this._moviesModel.getComments(card.id));
      this._movieControllers.push(movieController);
    });
  }

  _renderTopRatedMovie() {
    const movies = this._getSortMovies(this._currenSortType, this._moviesModel.getMovies());
    const siteFilmListContainerExtraElements = this._listFilmCardsComponent.getElement().querySelectorAll(`.films-list--extra`);
    this._siteFilmsListContainerElements[1].innerHTML = ``;
    if (isTopRatedMovieShowing(movies, `rating`)) {
      this._renderCardTop(getTopRatedMovie(movies, `rating`), this._siteFilmsListContainerElements[1], this._onDataChange, this._onViewChange, this._onCommentDataChange);
    } else {
      siteFilmListContainerExtraElements[0].classList.add(`visually-hidden`);
    }
  }

  _renderMostCommentedMovie() {
    const movies = this._getSortMovies(this._currenSortType, this._moviesModel.getMoviesAll());
    const siteFilmListContainerExtraElements = this._listFilmCardsComponent.getElement().querySelectorAll(`.films-list--extra`);
    this._siteFilmsListContainerElements[2].innerHTML = ``;
    if (isTopCommentedMovieShowing(movies, `comments`)) {
      this._renderCardTop(getTopCommentedMovie(movies, `comments`), this._siteFilmsListContainerElements[2], this._onDataChange, this._onViewChange, this._onCommentDataChange);
    } else {
      siteFilmListContainerExtraElements[1].classList.add(`visually-hidden`);
    }
  }

  _renderCardTop(cards, container, onDataChange, onViewChange, onDataCommentChange) {
    cards.forEach((card) => {
      const movieController = new MovieController(container, onDataChange, onViewChange, onDataCommentChange);
      movieController.render(card, this._moviesModel.getComments(card.id));
      this._topMoviesModel.push(card);
      this._movieTopControllers.push(movieController);
    });
  }

  _renderShowMoreButton() {
    const movieCards = this._getSortMovies(this._currenSortType, this._moviesModel.getMovies());
    removeComponent(this._showMoreButtonComponent);
    const siteFilmsList = this._listFilmCardsComponent.getElement().querySelector(`.films-list`);
    render(siteFilmsList, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
    const showedCardsCount = this._movieControllers.length;
    // показать еще карточки с фильмами

    let moviesLeft = movieCards.length - showedCardsCount;
    const onAutoLoad = () => {
      if (moviesLeft <= 0) {
        removeComponent(this._showMoreButtonComponent);
      }
    };

    onAutoLoad();
    let start = 0;

    const onLoadCardsButtonClick = () => {
      let counter = Math.min(CARD_COUNT, moviesLeft);
      start = start + CARD_COUNT;
      this._renderCard(getCardShowing(this._getSortMovies(this._currenSortType, this._moviesModel.getMovies()), start, counter), this._siteFilmsListContainerElements[0], this._onDataChange, this._onViewChange, this._onCommentDataChange);
      moviesLeft = moviesLeft - CARD_COUNT;
      onAutoLoad();
    };
    this._showMoreButtonComponent.setClickHandler(onLoadCardsButtonClick);
  }

  _getSortMovies(sortType, sortMovies) {
    switch (sortType) {
      case SortType.DATE:
        return sortFilmCards(sortMovies, `releaseDate`);
      case SortType.RATING:
        return sortFilmCards(sortMovies, `rating`);
      case SortType.DEFAULT:
        return sortMovies;
    }
    return sortMovies;
  }

  _onSortChange(sortType) {
    this._currenSortType = sortType;
    let sortMovies = this._getSortMovies(this._currenSortType, this._moviesModel.getMovies());
    const showedCardsCount = this._movieControllers.length;
    this._removeMovies();
    this._renderCard(getCardShowing(sortMovies, 0, showedCardsCount), this._siteFilmsListContainerElements[0], this._onDataChange, this._onViewChange, this._onCommentDataChange);
    this._renderShowMoreButton();
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

    if (MOVIE_COUNT) {
      drawMovieCards();
    } else {
      drawMessageNoFilms();
    }
  }
}
