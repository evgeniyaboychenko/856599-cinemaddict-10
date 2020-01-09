import ListFilmCardsComponent from '../components/list-film-cards.js';
import ShowMoreButtonComponent from '../components/show-more-button.js';

import NoDataFilmComponent from '../components/no-data_film.js';
import SortFilmComponent, {SortType} from '../components/sort.js';

import {CARD_COUNT, MOVIE_COUNT, CARD_COUNT_TOP} from '../const.js';

import {generateRandomArray} from '../utils/utils.js';
import {render, RenderPosition, removeComponent} from '../utils/render.js';
import MovieController from './movie.js';

// функция определяющая TOP
const isTopMovieShowing = (cards, field) => {
  return cards.some((card) => card[field] > 0);
};

const getFilteredArray = (array, i, field) => {
  return array.filter((item) => array[i][field] === item[field]);
};

const getTopMovie = (cards, field) => {
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

const getCardShowing = (cards, start, count) => {
  return cards.slice(start, start + count);
};


export default class PageController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;
    //this._movies = [];
    this._sortFilmComponent = new SortFilmComponent();
    this._listFilmCardsComponent = new ListFilmCardsComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._noDataFilmComponent = new NoDataFilmComponent();

    this._onViewChange = this._onViewChange.bind(this);

    this._onDataChange = this._onDataChange.bind(this);
    this._movieControllers = [];

  }

  _onViewChange() {
    this._movieControllers.forEach((item) => {
      item.setDefaultView();
    });
  }

  _onDataChange(movieController, oldData, newData) {
    const isSuccess = this._moviesModel.updateMovies(oldData.id, newData);
    if (isSuccess) {
      movieController.render(newData);
    }
    // const index = this._movies.findIndex((it) => it === oldData);

    // if (index === -1) {
    //   return;
    // }

    // const copyMovies = this._movies.slice();
    // copyMovies.splice(index, 1, newData);
    // this._movies = copyMovies;


    //movieController.render(this._movies[index]);

  }

  render() {

    const renderCard = (cards, container, onDataChange, onViewChange) => {
      cards.forEach((card) => {

        const movieController = new MovieController(container, onDataChange, onViewChange);
        movieController.render(card);
        this._movieControllers.push(movieController);

      });
    };
    //this._movies = movies;
    const movies = this._moviesModel.getMovies();

    const drawMovieCards = () => {

      render(this._container, this._sortFilmComponent, RenderPosition.BEFOREEND);
      render(this._container, this._listFilmCardsComponent, RenderPosition.BEFOREEND);
      const siteFilmsList = this._listFilmCardsComponent.getElement().querySelector(`.films-list`);
      const siteFilmsListContainerElements = this._listFilmCardsComponent.getElement().querySelectorAll(`.films-list__container`);
      renderCard(getCardShowing(movies, 0, CARD_COUNT), siteFilmsListContainerElements[0], this._onDataChange, this._onViewChange);
      const siteFilmListContainerExtraElements = this._listFilmCardsComponent.getElement().querySelectorAll(`.films-list--extra`);

      if (isTopMovieShowing(movies, `rating`)) {
        renderCard(getTopMovie(movies, `rating`), siteFilmsListContainerElements[1], this._onDataChange, this._onViewChange);
      } else {
        siteFilmListContainerExtraElements[0].classList.add(`visually-hidden`);
      }
      if (isTopMovieShowing(movies, `commentsCount`)) {
        renderCard(getTopMovie(movies, `commentsCount`), siteFilmsListContainerElements[2], this._onDataChange, this._onViewChange);
      } else {
        siteFilmListContainerExtraElements[1].classList.add(`visually-hidden`);
      }

      // функция рендеринга кнопки и отрисовка оставшихся фильмов
      const renderShowMoreButton = (movieCards) => {
        render(siteFilmsList, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

        // показать еще карточки с фильмами
        let moviesLeft = MOVIE_COUNT - CARD_COUNT;
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
          renderCard(getCardShowing(movieCards, start, counter), siteFilmsListContainerElements[0], this._onDataChange, this._onViewChange);
          moviesLeft = moviesLeft - CARD_COUNT;
          onAutoLoad();
        };
        this._showMoreButtonComponent.setClickHandler(onLoadCardsButtonClick);
      };

      renderShowMoreButton(movies);

      const sortFilmCards = (filmCards, field) => {
        return (filmCards.slice().sort((a, b) => {
          return b[field] - a[field];
        }));
      };

      this._sortFilmComponent.setSortTypeChangeHandler((sortType) => {
        let sortMovies = movies;
        switch (sortType) {
          case SortType.DATE:
            sortMovies = sortFilmCards(movies, `releaseDate`);
            break;
          case SortType.RATING:
            sortMovies = sortFilmCards(movies, `rating`);
            break;
          case SortType.DEFAULT:
            sortMovies = movies;
            break;
        }

        siteFilmsListContainerElements[0].innerHTML = ``;
        removeComponent(this._showMoreButtonComponent);
        renderCard(getCardShowing(sortMovies, 0, CARD_COUNT), siteFilmsListContainerElements[0], this._onDataChange, this._onViewChange);
        renderShowMoreButton(sortMovies);
      }
      );

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
