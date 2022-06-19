import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class CommentsModel extends Observable {
  #commentsApiService = null;
  #comments = [];

  constructor(commentsApiService) {
    super();
    this.#commentsApiService = commentsApiService;

    // this.#commentsApiService.comments.then((comments) => {
    //   console.log('наши комменты с сервера', comments);
    // });
  }

  get filmComments() {
    return this.#comments;
  }

  init = async () => { // async опеределяет асин.функцию, результатом будет новый промис
    try {
      this.#comments = await this.#commentsApiService.comments; // await дожидается окончание выполнение запроса
    } catch (err) {
      this.#comments = [];
    }

    this._notify(UpdateType.MAJOR);
  };

  addComment = async (updateType, update) => {

    try {
      const card = await this.#commentsApiService.addComment(update);
      const newComment = card.comments[card.comments.length - 1];
      this.#comments = [
        ...this.#comments,
        newComment,
      ];
      this._notify(updateType, newComment);
    } catch (err) {
      throw new Error('Can\'t add comment');
    }
  };

  deleteComment = async (updateType, commentId) => {
    const index = this.#comments.findIndex((comment) => comment.id === commentId);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      // Метода удаления коммента на сервере ничего не возвращает, так как удаление
      await this.#commentsApiService.deleteComment(commentId);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
      this._notify(updateType);
    } catch (err) {
      throw new Error('Can\'t delete comment');
    }
  };
}
