import Observable from '../framework/observable.js';
import {generateFilmCard} from '../mock/film-card.js';

export default class FilmCardsModel extends Observable {
  #filmsCards = Array.from({length: 12}, generateFilmCard);

  get filmCards() {
    return this.#filmsCards;
  }
}
