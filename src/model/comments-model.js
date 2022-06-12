import Observable from '../framework/observable.js';
import {generateComment} from '../mock/comment.js';

export default class CommentsModel extends Observable {
  #comments = {};

  constructor(commentsCount) {
    super();
    this.#comments = Array.from({length: commentsCount}, generateComment);
  }

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

  deleteComment = (updateType, updatedCommentId) => {
    const index = this.#comments.findIndex((comment) => comment.id === updatedCommentId);

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
