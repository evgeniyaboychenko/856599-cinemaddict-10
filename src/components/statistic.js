import AbstractSmartComponent from './abstract-smart-component.js';
import Chart from 'chart.js';
import ChartDatalabels from 'chartjs-plugin-datalabels';
import {generateMovieFilters} from '../mock/filters.js';
import {getProfileRating} from '../utils/utils.js';
import {FilterByDateForStatistic as FilterByDateForStatistic} from '../const.js';
import moment from 'moment';

const getWatchedMovies = (movies) => {
  return movies.filter((movie) => movie.isHistory);
};

const getTotalDuration = (watchedMovies) => {
  let duration = 0;
  watchedMovies.forEach((watchedMovie) => {
    duration = duration + watchedMovie.runtime;
  });
  return duration;
};

const getGenres = (watchedMovies) => {
  let genres = [];
  watchedMovies.forEach((movie) => {
    genres = genres.concat(movie.genres);
  });
  return genres;
};

const getGenresWithCount = (watchedMovies) => {
  let genres = getGenres(watchedMovies);
  let genresWithCount = [];
  genres = genres.sort();
  let index = 0;
  while(genres.length !== 0) {
    let topGenre = genres[0];
    genresWithCount.push({
     genre: topGenre,
     count: genres.filter((i) => topGenre === i).length,
    }
    );
    genres.splice(0, genresWithCount[index].count);
    index ++;
  }
  genresWithCount.sort((a,b) => {
    return (b.count - a.count);
  });
    return genresWithCount;
};

const getMoviesByDateRange = (movies, dateFrom, dateTo) => {
  return movies.filter((movie) => {
    const watchingDate = movie.watching_date;
    return watchingDate >= dateFrom && watchingDate <= dateTo;
  });
};

 const getFiltredMoviesByDate = (movies, filterType) => {
  switch (filterType) {
    case FilterByDateForStatistic.ALL:
      return movies;
    case FilterByDateForStatistic.TODAY:
      return getMoviesByDateRange(movies, moment().hours(0).minutes(0).seconds(0).format(), moment().format());
    case FilterByDateForStatistic.WEEK:
      return getMoviesByDateRange(movies, moment().subtract(7, `days`).format(), moment().format());
    case FilterByDateForStatistic.MONTH:
      return getMoviesByDateRange(movies, moment().subtract(1, `month`).format(), moment().format());
    case FilterByDateForStatistic.YEAR:
      return getMoviesByDateRange(movies, moment().subtract(1, `year`).format(), moment().format());
  }
  return movies;
}
// функция возвращающая блок, для стаистики
const createStatisticTemplate = (moviesModel, selectedFilterDate) => {
  const watchedMovies = getWatchedMovies(moviesModel.getMoviesAll());
  const filteredMoviesByDate = getFiltredMoviesByDate(watchedMovies, selectedFilterDate);
  console.log(filteredMoviesByDate);
  const countWatchedMoviesTotal = watchedMovies.length;
  const profileRating = getProfileRating(countWatchedMoviesTotal);
  const countWatchedMovies = filteredMoviesByDate.length;
  const totalDuration = getTotalDuration(filteredMoviesByDate);
  const totalDurationInHours = Math.trunc(totalDuration/60);
  const totalDurationInMinutes = moment.duration(totalDuration, "minutes").minutes();
  const genresWithCount = getGenresWithCount(filteredMoviesByDate);
  return (
    `<section class="statistic">
      ${profileRating ?
      `<p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${profileRating}</span>
      </p>` : ``}
      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${countWatchedMovies} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${totalDurationInHours} <span class="statistic__item-description">h</span> ${totalDurationInMinutes} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${countWatchedMovies ? genresWithCount[0].genre : `-`}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>
  </section>`
  );
};

export default class Statistic extends AbstractSmartComponent {
  constructor(moviesModel) {
    super();
    this._moviesModel = moviesModel;
    this._renderCharts();
    this._selectedFilterDate = FilterByDateForStatistic.ALL;

  }
  getTemplate() {
    return createStatisticTemplate(this._moviesModel, this._selectedFilterDate);
  }

  show() {
    super.show();
    this.rerender();
  }

  hide() {
    super.hide();
    this._selectedFilterDate = FilterByDateForStatistic.ALL
  }

  recoveryListeners() {
    this._subscribeOnEvents();
  }

  _onChangeFilterDate(selectedFilterDate) {
    this._selectedFilterDate = selectedFilterDate;
    this.rerender();
  }

  _subscribeOnEvents() {
    // события окна
    this.getElement().addEventListener(`change`, (evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }
      this._selectedFilterDate = evt.target.id;
      this._onChangeFilterDate(this._selectedFilterDate);
    });
  }

  rerender() {
    super.rerender();
    this.setActiveFilter(this._selectedFilterDate);
    this._renderCharts();
  }

  setActiveFilter(selectedFilterDate) {
    const item = this.getElement().querySelector(`#${selectedFilterDate}`);
    if (item) {
      item.checked = true;
    }
  }

  _renderCharts() {
    const movies = this._moviesModel.getMoviesAll();
    const watchedMovies = getWatchedMovies(movies);
    const filterdMoviesByDate = getFiltredMoviesByDate(watchedMovies, this._selectedFilterDate);
    if (!filterdMoviesByDate.length) {
      return;
    }
    let genresWithCount = getGenresWithCount(filterdMoviesByDate);
    const labelsChart = genresWithCount.map((item) => {return item.genre;});
    const countChart = genresWithCount.map((item) => {return item.count;});
    Chart.defaults.global.defaultFontColor = 'white';
    Chart.defaults.global.defaultFontSize = 20;
    const element = this.getElement();
    const daysCtx = element.querySelector(`.statistic__chart`);
    new Chart(daysCtx, {
      plugins: [ChartDatalabels],
      type: `horizontalBar`,
      data: {
        labels: labelsChart,
        datasets: [{
          dataset: 10,
          data: countChart,
          backgroundColor: `#ffe800` ,
          barThickness: 30,
        }]
      },
      options: {
        plugins: {
          datalabels: {
            display: true,
            anchor: `start`,
            align: `left`,
            padding: {
              left: 100,
              right: 0,
              top: 0,
              bottom: 0
            },
          }
        },
        legend: {
         display: false,
        },
        hover: false,
        tooltips: {
          enabled: false,
        },
        scales:{
          yAxes: [{
            gridLines: {
              display: false
            },
            ticks: {
              min: 0,
              padding: 120,
            },
          }],
          xAxes: [{
            gridLines: {
              display: false
            },
            ticks: {
              min: 0,
              display: false,
            },
          }],
        },
      },
  }
);
}
}
