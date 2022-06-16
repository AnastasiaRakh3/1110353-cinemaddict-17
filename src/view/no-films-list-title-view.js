import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

const NoFilmsListTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createNoFilmsListTitleTemplate = (filterType) => {
  const noFilmsListTextValue = NoFilmsListTextType[filterType];

  return `<h2 class="films-list__title">${noFilmsListTextValue}</h2>`;
};

export default class NoFilmsListTitleView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoFilmsListTitleTemplate(this.#filterType);
  }
}
