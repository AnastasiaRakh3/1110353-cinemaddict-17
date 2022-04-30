import {generateFilmCard} from '../mock/film-card.js';

export default class PopupModel {
  popup = generateFilmCard();
  getPopup = () => this.popup;
}
