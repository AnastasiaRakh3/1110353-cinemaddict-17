import AbstractView from '../framework/view/abstract-view.js';

const createNavigationTemplate = () => `<nav class="main-navigation">
<a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
<a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">0</span></a>
<a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">0</span></a>
<a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">0</span></a>
</nav>`;

export default class NavigationView extends AbstractView {
  get template() {
    return createNavigationTemplate();
  }
}
