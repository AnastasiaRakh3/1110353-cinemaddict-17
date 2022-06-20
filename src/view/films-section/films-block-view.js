import AbstractView from '../../framework/view/abstract-view';

const createFilmsBlockTemplate = () => '<section class="films"></section>';

export default class FilmsBlockView extends AbstractView {
  get template() {
    return createFilmsBlockTemplate();
  }
}
