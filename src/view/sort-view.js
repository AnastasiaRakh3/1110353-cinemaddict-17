import AbstractView from '../framework/view/abstract-view.js';
import {SortType} from '../const.js';


const createSortingTemplate = (activeSortType) => {
  const createListElement = (sortType) => `<li><a href="#" class="sort__button ${sortType === activeSortType ? 'sort__button--active': ''}" data-sort-type="${sortType}">Sort by ${sortType}</a></li>`;

  return `<ul class="sort">
  ${Object.entries(SortType).map(([, value]) => createListElement(value)).join('')}
  </ul>`;
};


export default class SortView extends AbstractView {
  #activeSortType = null;

  constructor(activeSortType) {
    super();
    this.#activeSortType = activeSortType;
  }

  get template() {
    return createSortingTemplate(this.#activeSortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    // Проверка, что нажали именно на ссылку
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}


