import ApiService from '../framework/api-service';
import { Method } from '../server-config';

export default class CardsApiService extends ApiService {

  get cards() {
    // По умолчанию GET запрос
    return this._load({ url: 'movies' }) //отправка запроса к серверу, где пока только адрес относит-но сервера
      .then(ApiService.parseResponse); //стат.метод parseResponse вызывается только у самого класса, обработки ответа (превращает в json формат)
  }

  // Для PUT запроса
  updateCard = async (card) => { // async опеределяет асин.функцию, результатом будет новый промис
    // Отправляет запрос
    const response = await this._load({ // await дожидается окончание выполнение запроса
      url: `movies/${card.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(card)), // JSON.stringify преобразует карточку в строку JSON
      headers: new Headers({ 'Content-Type': 'application/json' }), //Определяет тип содерж-го
    });

    // Принял ответ после отправки, переделал в json формат
    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  #adaptToServer = (card) => {
    const adaptedTask = {
      ...card,
      'film_info': {
        ...card.filmInfo,
        'age_rating': card.filmInfo.ageRating,
        'alternative_title': card.filmInfo.alternativeTitle,
        'release': {
          ...card.filmInfo.release,
          'release_country': card.filmInfo.release.releaseCountry
        },
        'total_rating': card.filmInfo.totalRating,
      },
      'user_details': {
        ...card.userDetails,
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
