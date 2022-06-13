import Observable from '../framework/observable.js';
import {generateFilmCard} from '../mock/film-card.js';

export default class FilmCardsModel extends Observable {
  #filmsCards = Array.from({length: 30}, generateFilmCard);

  get filmCards() {
    return this.#filmsCards;
  }

  // Обновляет карточку в списке и в this.#filmsCards оказывается уже массив с обновленной карточкой, но все еще тот же массив
  updateCard = (updateType, updatedCard) => {
    const index = this.#filmsCards.findIndex((card) => card.id === updatedCard.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting card');
    }

    this.#filmsCards = [
      ...this.#filmsCards.slice(0, index),
      updatedCard,
      ...this.#filmsCards.slice(index + 1),
    ];
    // ??
    this._notify(updateType, updatedCard);
  };
}
