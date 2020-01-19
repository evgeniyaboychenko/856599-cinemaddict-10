import {render, RenderPosition, replace} from '../utils/render.js';
import MainNavigationComponent from '../components/main-navigation.js';
import {FilterType} from '../const.js';
import {getMoviesByFilter} from '../models/movies.js';
import StatisticComponent from '../components/statistic.js';

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
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._activeFilterType = FilterType.ALL;

    this._onFilterChange = this._onFilterChange.bind(this);

    this._onDataChange = this._onDataChange.bind(this);
    this._moviesModel.setDataChangedHandler(this._onDataChange);

    this._mainNavigationComponent = null;
    this._statisticComponent = null;

    this._handlerMenuChanged = null;
  }

  // _onMenuStatsActive(){
  //   return true;
  // }

  _onDataChange() {
    this.render();
    this._mainNavigationComponent.setCurrentFilter(this._activeFilterType);
  }

  render() {
    const movies = this._moviesModel.getMoviesAll();
    const filters = generateMovieFilters(movies, this._activeFilterType);

    const oldMainNavigationComponent = this._mainNavigationComponent;
    this._mainNavigationComponent = new MainNavigationComponent(filters);

    if (oldMainNavigationComponent) {
      replace(this._mainNavigationComponent, oldMainNavigationComponent);
    } else {
      render(this._container, this._mainNavigationComponent, RenderPosition.BEFOREEND);
    }

   // this._statisticComponent = new StatisticComponent();
    // console.log(this._statisticComponent);
    //render(this._container, this._statisticComponent, RenderPosition.BEFOREEND);
   // this._statisticComponent.hide();
    this._mainNavigationComponent.setFilterChangedHandler(this._onFilterChange);
    // this._mainNavigationComponent.setOnMenuStatsChangeHandler(this._onMenuStatsClick);
  }

  // _onMenuStatsClick() {
  //   this._statisticComponent.show();
  // }
  setOnMenuChanged(handler) {
    this._handlerMenuChanged = handler;
  }

  _onFilterChange(filterType) {
    if(filterType === `Stats`) {
      this._handlerMenuChanged(true);
      return;
    }
    this._handlerMenuChanged(false);
    this._activeFilterType = filterType;
    this._moviesModel.setFilter(this._activeFilterType);
  }
}
