import ApiService from '../framework/api-service';

// const Method = {
//   GET: 'GET',
//   PUT: 'PUT',
// };

export default class CommentsApiService extends ApiService {
  #cardId = null;

  constructor(address, autho, cardId) {
    super(address, autho);
    this.#cardId = cardId;
  }

  get comments() {
    // По умолчанию GET запрос
    return this._load({url: `comments/${this.#cardId}`})
      .then(ApiService.parseResponse);
  }

  // updateTask = async (task) => {
  //   const response = await this._load({
  //     url: `tasks/${task.id}`,
  //     method: Method.PUT,
  //     body: JSON.stringify(task),
  //     headers: new Headers({'Content-Type': 'application/json'}),
  //   });
  //   const parsedResponse = await ApiService.parseResponse(response);
  //   return parsedResponse;
  // };
}
