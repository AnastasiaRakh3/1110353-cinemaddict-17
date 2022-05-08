import {generateFilmCard} from '../mock/film-card.js';

export default class FilmCardsModel {
  #filmsCards = Array.from({length: 12}, generateFilmCard);

  get filmCards() {
    return this.#filmsCards;
  }
}
