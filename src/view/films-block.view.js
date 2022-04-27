import {createElement} from '../render.js';

const createFilmsBlockTemplate = () => '<section class="films"></section>';

export default class FilmsBlockView {
  getTemplate() {
    return createFilmsBlockTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
