import {remove, render, RenderPosition} from '../framework/render.js';
import PopupCommentView from '../view/popup-comment-view.js';
import PopupCommentsListView from '../view/popup-comments-list.js';
import PopupNewCommentView from '../view/popup-new-comment.js';

export default class CommentsPresenter {
  #commentsModel = null;
  #commentsContainer = null;

  #commentsDataList = [];
  #popupCommentsListComponent = null;
  #popupNewCommentComponent = null;

  constructor (commentsModel, commentsContainer) {
    this.#commentsModel = commentsModel;
    this.#commentsContainer = commentsContainer;
  }

  init = () => {
    const prevPopupCommentsListComponent = this.#popupCommentsListComponent;

    this.#commentsDataList = [...this.#commentsModel.comments];
    this.#popupCommentsListComponent = new PopupCommentsListView();
    this.#popupNewCommentComponent = new PopupNewCommentView();

    for (let i = 0; i < this.#commentsDataList.length; i++) {
      render(new PopupCommentView(this.#commentsDataList[i]), this.#popupCommentsListComponent.element);
    }

    render(this.#popupCommentsListComponent, this.#commentsContainer, RenderPosition.AFTEREND);
    render(this.#popupNewCommentComponent, this.#popupCommentsListComponent.element, RenderPosition.BEFOREEND);

    remove(prevPopupCommentsListComponent);
  };
}
