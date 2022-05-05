import {generateFilmCard} from '../mock/film-card.js';

export default class PopupModel {
  #popup = generateFilmCard();

  get popup() {
    return this.#popup;
  }
}
