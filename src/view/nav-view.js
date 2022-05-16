import AbstractView from '../framework/view/abstract-view.js';

const createNavigationItemTemplate = (filter, isChosen) => {
  const {name, count} = filter;
  const countInfo =  `<span class="main-navigation__item-count">${count}</span>`;

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

  return `<a href="#filter__${name}" class="main-navigation__item ${isChosen ? 'main-navigation__item--active' : ''}">${showName(name)} ${name === 'all' ? '' : countInfo}</a>`;
};

const createNavigationTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createNavigationItemTemplate(filter, index === 0))
    .join('');

  return `<nav class="main-navigation">
    ${filterItemsTemplate}
    </nav>`;
};

export default class NavigationView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createNavigationTemplate(this.#filters);
  }
}
