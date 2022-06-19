import AbstractView from '../framework/view/abstract-view.js';

const createFilmsListTitleTemplate = () => '<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>';

export default class FilmsListTitleView extends AbstractView {
  get template() {
    return createFilmsListTitleTemplate();
  }
}
