import {render} from '../framework/render.js';
import PopupCommentView from '../view/popup-comment-view.js';

export default class CommentsPresenter {
  #commentsContainer = null;
  #commentsModel = null;
  #blockComments = [];

  init = (commentsContainer, commentsModel) => {
    this.#commentsContainer = commentsContainer;
    this.#commentsModel = commentsModel;
    this.#blockComments = [...this.#commentsModel.comments];

    for (let i = 0; i < this.#blockComments.length; i++) {
      render(new PopupCommentView(this.#blockComments[i]), this.#commentsContainer);
    }
  };
}
