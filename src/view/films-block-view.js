import AbstractView from '../framework/view/abstract-view.js';

const createFilmsBlockTemplate = () => '<section class="films"></section>';

export default class FilmsBlockView extends AbstractView {
  get template() {
    return createFilmsBlockTemplate();
  }
}
