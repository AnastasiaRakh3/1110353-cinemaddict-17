import AbstractView from '../framework/view/abstract-view.js';

const createFiltersItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  const countInfo =  `<span class="main-navigation__item-count">${count}</span>`;
  const isChosenClass = type === currentFilterType ? 'main-navigation__item--active' : '';

  const makeFirstLetterUp = (str) => {
    const firstLetter = str.substr(0, 1);
    return firstLetter.toUpperCase() + str.substr(1);
  };

  const showName = (cardName) => {
    if (cardName === 'all') {
      return 'All movies';
    }
    return makeFirstLetterUp(cardName);
  };

  return `<a href="#filter__${name}" class="main-navigation__item ${isChosenClass}" data-filter-type="${type}">${showName(name)} ${name === 'all' ? '' : countInfo}</a>`;
};

const createFiltersTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFiltersItemTemplate(filter, currentFilterType))
    .join('');

  return `<nav class="main-navigation">
    ${filterItemsTemplate}
    </nav>`;
};

export default class FiltersView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    // Проверка, что нажали именно на ссылку
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  };

}
