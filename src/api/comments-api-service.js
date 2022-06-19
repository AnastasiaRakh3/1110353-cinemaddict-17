import ApiService from '../framework/api-service';
import { Method } from '../server-config';

export default class CommentsApiService extends ApiService {
  #cardId = null;

  constructor(address, autho, cardId) {
    super(address, autho);
    this.#cardId = cardId;
  }

  get comments() {
    // По умолчанию GET запрос
    return this._load({ url: `comments/${this.#cardId}` })
      .then(ApiService.parseResponse);
  }

  // Для PUT запроса
  addComment = async (newComment) => { // async опеределяет асин.функцию, результатом будет новый промис
    // Отправляет запрос
    const response = await this._load({ // await дожидается окончание выполнение запроса
      url: `comments/${this.#cardId}`,
      method: Method.POST,
      body: JSON.stringify(newComment), // JSON.stringify преобразует карточку в строку JSON
      headers: new Headers({ 'Content-Type': 'application/json' }), //Определяет тип содерж-го
    });

    // Принял ответ после отправки, переделал в json формат
    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  deleteComment = async (commentId) => {
    const response = await this._load({
      url: `comments/${commentId}`,
      method: Method.DELETE,
    });

    return response;
  };


}
