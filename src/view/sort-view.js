import AbstractView from '../framework/view/abstract-view.js';
import {SortType} from '../const.js';

// const checkIsActive = (el) => el.hasFocus() ? 'sort__button--active' : '';

// const createSortingTemplate = () => `<ul class="sort">
// <li><a href="#" class="sort__button ${checkIsActive()}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
// <li><a href="#" class="sort__button ${checkIsActive()}" data-sort-type="${SortType.DATE_UP}">Sort by date</a></li>
// <li><a href="#" class="sort__button ${checkIsActive()}" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
// </ul>`;

const createSortingTemplate = () => `<ul class="sort">
<li><a href="#" class="sort__button" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
<li><a href="#" class="sort__button" data-sort-type="${SortType.DATE_UP}">Sort by date</a></li>
<li><a href="#" class="sort__button" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
</ul>`;

export default class SortView extends AbstractView {
  get template() {
    return createSortingTemplate();
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
    // this.element.classList.toggle('sort__button--active');
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}
