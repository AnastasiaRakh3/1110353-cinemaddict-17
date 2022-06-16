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
    } catch(err) {
      this.#comments = [];
    }

    this._notify(UpdateType.MAJOR);
  };

  addComment = async (updateType, update) => {

    try {
      const addedComment = await this.#commentsApiService.addComment(update);
      console.log(addedComment);
      this.#comments = [
        ...this.#comments,
        addedComment,
      ];

      this._notify(updateType, addedComment);
    } catch(err) {
      throw new Error('Can\'t add comment');
    }
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
