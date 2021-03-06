import FiltersView from '../view/filters-view.js';
import { FilterType, UpdateType } from '../const.js';
import { filter } from '../utils/filter.js';
import { render, replace, remove } from '../framework/render.js';

export default class FiltersPresenter {
  #renderingPlace = null;
  #cardsModel = null;
  #filtersModel = null;

  #filtersComponent = null;

  constructor(renderingPlace, cardsModel, filtersModel) {
    this.#cardsModel = cardsModel;
    this.#renderingPlace = renderingPlace;
    this.#filtersModel = filtersModel;

    this.#cardsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const filmCards = this.#cardsModel.filmCards;

    return [
      {
        type: FilterType.ALL,
        name: 'all',
        count: filter[FilterType.ALL](filmCards).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'watchlist',
        count: filter[FilterType.WATCHLIST](filmCards).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'history',
        count: filter[FilterType.HISTORY](filmCards).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'favorites',
        count: filter[FilterType.FAVORITES](filmCards).length,
      },
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFiltersComponent = this.#filtersComponent;

    this.#filtersComponent = new FiltersView(filters, this.#filtersModel.filter);
    this.#filtersComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFiltersComponent === null) {
      render(this.#filtersComponent, this.#renderingPlace);
      return;
    }

    replace(this.#filtersComponent, prevFiltersComponent);
    remove(prevFiltersComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filtersModel.filter === filterType) {
      return;
    }
    this.#filtersModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
