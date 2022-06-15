import ApiService from '../framework/api-service';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class CardsApiService extends ApiService {
  get cards() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  updateCard = async (card) => {
    const response = await this._load({
      url: `movies/${card.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(card)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  #adaptToServer = (card) => {
    const adaptedTask = {...card,
      'film_info': {...card.filmInfo,
        'age_rating': card.filmInfo.ageRating,
        'alternative_title': card.filmInfo.alternativeTitle,
        'release': {...card.filmInfo.release,
          'release_country': card.filmInfo.release.releaseCountry},
        'total_rating': card.filmInfo.totalRating,
      },
      'user_details': {...card.userDetails,
        'already_watched': card.userDetails.alreadyWatched,
        'watching_date': card.userDetails.watchingDate,
      },
    };

    // Ненужные ключи мы удаляем
    delete adaptedTask.filmInfo;
    delete adaptedTask['film_info'].ageRating;
    delete adaptedTask['film_info'].alternativeTitle;
    delete adaptedTask['film_info']['release'].releaseCountry;
    delete adaptedTask['film_info'].totalRating;
    delete adaptedTask.userDetails;
    delete adaptedTask['user_details'].alreadyWatched;
    delete adaptedTask['user_details'].watchingDate;

    return adaptedTask;
  };
}
