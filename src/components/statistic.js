import AbstractSmartComponent from './abstract-smart-component.js';
import Chart from 'chart.js';
import ChartDatalabels from 'chartjs-plugin-datalabels';
import {generateMovieFilters} from '../mock/filters.js';
import {getProfileRating} from '../utils/utils.js';

const getWatchedMovies = (movies) => {
  return movies.filter((movie) => movie.isHistory);
};

const getTotalDuration = (watchedMovies) => {
  const rr = 0;
  watchedMovies.forEach((watchedMovie) => {
    //console.log(watchedMovie.runtime);
  // считаю время
  });
  return rr;
};

const getTopGenres = (watchedMovies) => {
  let genress = [];
  watchedMovies.forEach((movie) => {
    genress = genress.concat(movie.genres);
  });
  console.log(genress);
  return genress;
};

const getGeresCount = (genres) => {
// return {
//   genre: type,
//   count : 10
// }
let filtredGenre =[];
let rr = {};
let firstElement = genres.shift();
filtredGenre = genres.filter((item) => item === firstElement);
rr.favoriteGenre =firstElement;
rr.count = filtredGenre.length + 1;
console.log(rr);

return {
  favoriteGenre: `sci`,
  count: 3,
}
};

// функция возвращающая блок, для стаистики
const createStatisticTemplate = (moviesModel) => {
  const movies = moviesModel.getMoviesAll();
  console.log(movies);
  const countWatchedMovies = getWatchedMovies(movies).length;
  const profileRating = getProfileRating(countWatchedMovies);
  const d = getTotalDuration(getWatchedMovies(movies));
  const genresWithCoun = getGeresCount(getTopGenres(getWatchedMovies(movies)));
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
          <p class="statistic__item-text">130 <span class="statistic__item-description">h</span> 22 <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">Sci-Fi</p>
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
  }
  getTemplate() {
    return createStatisticTemplate(this._moviesModel);
  }

  _renderCharts() {
    Chart.defaults.global.defaultFontColor = 'white';
    Chart.defaults.global.defaultFontSize = 20;
    console.log(Chart.defaults);
    const element = this.getElement();
    const daysCtx = element.querySelector(`.statistic__chart`);
    new Chart(daysCtx, {
      plugins: [ChartDatalabels],
      type: `horizontalBar`,
      data: {
        labels: [`genre1`, `genre 2`, `genre1`, `genre 2`],
        datasets: [{
          dataset: 10,
          data:[22, 34, 30, 49],
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
            ticks: {
              min: 0,
              padding: 120,
            },
          }],
          xAxes: [{
            ticks: {
              min: 0,
              // display: false,
              fontColor: `#ffffff`
            },
          }],
        },
      },
  }
);
}
}
