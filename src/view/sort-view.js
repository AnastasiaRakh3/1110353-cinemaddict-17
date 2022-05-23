import AbstractView from '../framework/view/abstract-view.js';
import {SortType} from '../const.js';

const createSortingTemplate = () => `<ul class="sort">
<li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
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
    this.#checkClass();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };

  #checkClass = () => {
    const allButtons = Array.from(document.querySelectorAll('.sort__button'));
    allButtons.forEach((button) => {
      button.classList.remove('sort__button--active');
    });
    event.target.classList.add('sort__button--active');
  };
}


