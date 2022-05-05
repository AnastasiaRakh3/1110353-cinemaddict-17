import {createElement} from '../render.js';

const createFilmsBlockTemplate = () => '<section class="films"></section>';

export default class FilmsBlockView {
  #element = null;

  get template() {
    return createFilmsBlockTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
