import ApiService from '../framework/api-service';
import { Method } from '../server-config';

export default class CommentsApiService extends ApiService {
  #cardId = null;

  constructor(address, autho, cardId) {
    super(address, autho);
    this.#cardId = cardId;
  }

  get comments() {
    return this._load({ url: `comments/${this.#cardId}` })
      .then(ApiService.parseResponse);
  }

  addComment = async (newComment) => {
    const response = await this._load({
      url: `comments/${this.#cardId}`,
      method: Method.POST,
      body: JSON.stringify(newComment),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

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
