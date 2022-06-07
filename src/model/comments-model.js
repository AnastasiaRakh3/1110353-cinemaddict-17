import Observable from '../framework/observable.js';
import {generateComment} from '../mock/comment.js';

export default class CommentsModel extends Observable {
  #comments = Array.from({length: 5}, generateComment);

  get comments() {
    return this.#comments;
  }

  addComment = (updateType, updatedComment) => {
    this.#comments = [
      updatedComment,
      ...this.#comments,
    ];

    this._notify(updateType, updatedComment);
  };

  deleteComment = (updateType, updatedComment) => {
    const index = this.#comments.findIndex((comment) => comment.id === updatedComment.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];

    this._notify(updateType);
  };
}
