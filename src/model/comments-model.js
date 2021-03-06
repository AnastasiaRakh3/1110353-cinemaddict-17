import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class CommentsModel extends Observable {
  #commentsApiService = null;
  #comments = [];

  constructor(commentsApiService) {
    super();
    this.#commentsApiService = commentsApiService;
  }

  get filmComments() {
    return this.#comments;
  }

  init = async () => {
    try {
      this.#comments = await this.#commentsApiService.comments;
    } catch (err) {
      this.#comments = [];
    }

    this._notify(UpdateType.INIT);
  };

  addComment = async (updateType, update) => {

    try {
      const card = await this.#commentsApiService.addComment(update);
      const newComment = card.comments[card.comments.length - 1];
      this.#comments = [
        ...this.#comments,
        newComment,
      ];
      this._notify(updateType, card);
    } catch {
      throw new Error('Can\'t add comment');
    }
  };

  deleteComment = async (updateType, commentId) => {
    const index = this.#comments.findIndex((comment) => comment.id === commentId);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#commentsApiService.deleteComment(commentId);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
      this._notify(updateType, commentId);
    } catch {
      throw new Error('Can\'t delete comment');
    }
  };
}
