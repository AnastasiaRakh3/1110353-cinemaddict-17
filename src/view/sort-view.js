import AbstractView from '../framework/view/abstract-view.js';
import {SortType} from '../const.js';


const createSortingTemplate = (activeSortType) => {
  const checkIsActiveDefaultSort = activeSortType === SortType.DEFAULT ? 'sort__button--active' : '';
  const checkIsActiveDateUpSort = activeSortType === SortType.DATE_UP ? 'sort__button--active' : '';
  const checkIsActiveRatingSort = activeSortType === SortType.RATING ? 'sort__button--active' : '';

  return `<ul class="sort">
  <li><a href="#" class="sort__button ${checkIsActiveDefaultSort}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
  <li><a href="#" class="sort__button ${checkIsActiveDateUpSort}" data-sort-type="${SortType.DATE_UP}">Sort by date</a></li>
  <li><a href="#" class="sort__button ${checkIsActiveRatingSort}" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
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
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}


