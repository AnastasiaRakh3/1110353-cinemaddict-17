import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class FilmCardsModel extends Observable {
  #cardsApiService = null;
  #filmCards = [];

  constructor(cardsApiService) {
    super();
    this.#cardsApiService = cardsApiService;
  }

  get filmCards() {
    return [...this.#filmCards];
  }

  init = async () => {
    try {
      const cards = await this.#cardsApiService.cards;
      this.#filmCards = cards.map(this.#adaptToClient);
    } catch (err) {
      this.#filmCards = [];
    }

    this._notify(UpdateType.INIT);
  };

  updateCommentsInCard = (updateType, update) => {
    const index = this.#filmCards.findIndex((card) => card.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting card');
    }

    this.filmCards[index].comments = update.comments;
    this._notify(updateType, this.filmCards[index]);
  };

  updateCard = async (updateType, update) => {
    const index = this.#filmCards.findIndex((card) => card.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting card');
    }

    try {
      const response = await this.#cardsApiService.updateCard(update);
      const updatedCard = this.#adaptToClient(response);
      this.#filmCards = [
        ...this.#filmCards.slice(0, index),
        updatedCard,
        ...this.#filmCards.slice(index + 1),
      ];
      this._notify(updateType, updatedCard);
    } catch (err) {
      throw new Error('Can\'t update card');
    }
  };

  #adaptToClient = (card) => {
    const adaptedTask = {
      ...card,
      filmInfo: {
        ...card['film_info'],
        ageRating: card['film_info']['age_rating'],
        alternativeTitle: card['film_info']['alternative_title'],
        release: {
          ...card['film_info']['release'],
          releaseCountry: card['film_info']['release']['release_country']
        },
        totalRating: card['film_info']['total_rating'],
      },
      userDetails: {
        ...card['user_details'],
        alreadyWatched: card['user_details']['already_watched'],
        watchingDate: card['user_details']['watching_date'],
      }
    };

    delete adaptedTask['film_info'];
    delete adaptedTask['filmInfo']['age_rating'];
    delete adaptedTask['filmInfo']['alternative_title'];
    delete adaptedTask['filmInfo']['release']['release_country'];
    delete adaptedTask['filmInfo']['total_rating'];
    delete adaptedTask['user_details'];
    delete adaptedTask['userDetails']['already_watched'];
    delete adaptedTask['userDetails']['watching_date'];

    return adaptedTask;
  };
}
