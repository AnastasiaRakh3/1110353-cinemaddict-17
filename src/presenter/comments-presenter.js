import PopupCommentsListView from '../view/popup-comments-list-view.js';
import PopupNewCommentView from '../view/popup-new-comment.js';
import CommentPresenter from './comment-presenter.js';
import { UserAction, UpdateType } from '../const.js';
import { remove, render, RenderPosition } from '../framework/render.js';

export default class CommentsPresenter {
  #commentsModel = null;
  #commentsContainer = null;

  #popupCommentsListComponent = null;
  #popupNewCommentComponent = null;
  #commentPresenterList = new Map();

  constructor(commentsModel, commentsContainer) {
    this.#commentsModel = commentsModel;
    this.#commentsContainer = commentsContainer;

    this.#commentsModel.addObserver(this.#handleModelChange);
  }

  get commentsList() {
    return [...this.#commentsModel.filmComments];
  }

  init = () => {
    const prevPopupCommentsListComponent = this.#popupCommentsListComponent;

    this.#popupCommentsListComponent = new PopupCommentsListView(this.commentsList.length);
    this.#popupNewCommentComponent = new PopupNewCommentView();

    render(this.#popupCommentsListComponent, this.#commentsContainer, RenderPosition.AFTEREND);
    render(this.#popupNewCommentComponent, this.#popupCommentsListComponent.element, RenderPosition.BEFOREEND);
    this.#renderComments();
    this.#popupCommentsListComponent.setDeleteButtonClickHandler(this.#deleteComment);
    this.#popupNewCommentComponent.setAddCommentKeyDownHandler(this.#addComment);

    remove(prevPopupCommentsListComponent);
  };

  #handleViewAction = (actionType, updateType, update) => {
    // actionType - добавить или удалить комментарий
    switch (actionType) {
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(updateType, update);
        break;
    }
  };

  #handleModelChange = (updateType, update) => {
    switch (updateType) {
      case UpdateType.MAJOR:
        this.#clearComments();
        this.init();
    }
  };

  #renderComments = () => {
    const commentsContainer = this.#popupCommentsListComponent.element.querySelector('.film-details__comments-list');
    for (let i = 0; i < this.commentsList.length; i++) {
      const currentComment = this.commentsList[i];
      const commentPresenter = new CommentPresenter(commentsContainer);
      commentPresenter.init(currentComment);
      this.#commentPresenterList.set(currentComment.id, commentPresenter);
    }
  };

  #clearComments = () => {
    // Удаляет визуальное отображение комментария
    this.#commentPresenterList.forEach((presenter) => presenter.destroy());
    // Очищает мапу
    this.#commentPresenterList.clear();
  };

  #deleteComment = (commentId) => {
    this.#handleViewAction(UserAction.DELETE_COMMENT, UpdateType.MAJOR, commentId);
  };

  #addComment = (newComment) => {
    this.#handleViewAction(UserAction.ADD_COMMENT, UpdateType.MAJOR, newComment);
  };
}
