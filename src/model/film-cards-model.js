import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class FilmCardsModel extends Observable {
  #cardsApiService = null;
  #filmsCards = [];

  constructor(cardsApiService) {
    super();
    this.#cardsApiService = cardsApiService;
  }

  get filmCards() {
    return this.#filmsCards;
  }

  init = async () => {
    try {
      const cards = await this.#cardsApiService.cards;
      this. #filmsCards = cards.map(this.#adaptToClient);
    } catch(err) {
      this.#filmsCards = [];
    }
    this._notify(UpdateType.INIT);
  };


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

  #adaptToClient = (card) => {
    const adaptedTask = {...card,
      filmInfo: {...card['film_info'],
        ageRating: card['film_info']['age_rating'],
        alternativeTitle: card['film_info']['alternative_title'],
        release: {...card['film_info']['release'],
          releaseCountry: card['film_info']['release']['release_country']},
        totalRating: card['film_info']['total_rating'],
      },
      userDetails: {...card['user_details'],
        alreadyWatched: {...card['user_details']['already_watched']},
        watchingDate: {...card['user_details']['watching_date']},
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
