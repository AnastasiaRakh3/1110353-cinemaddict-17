import PopupCommentsListView from '../../view/popup/popup-comments-list-view.js';
import PopupNewCommentView from '../../view/popup/popup-new-comment.js';
import CommentPresenter from './comment-presenter.js';
import { UserAction, UpdateType, TimeLimit } from '../../const.js';
import { remove, render, RenderPosition } from '../../framework/render.js';
import UiBlocker from '../../framework/ui-blocker/ui-blocker.js';

export default class CommentsPresenter {
  #commentsModel = null;
  #commentsContainer = null;

  #popupCommentsListComponent = null;
  #popupNewCommentComponent = null;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);
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

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.DELETE_COMMENT:
        this.#commentPresenterList.get(update).setDeletingMode();
        try {
          await this.#commentsModel.deleteComment(updateType, update);
        } catch {
          this.#commentPresenterList.get(update).setDefaultMode();
        }
        break;
      case UserAction.ADD_COMMENT:
        try {
          await this.#commentsModel.addComment(updateType, update);
        } catch {
          this.#shakeNewComment();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelChange = (updateType) => {
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
    this.#commentPresenterList.forEach((presenter) => presenter.destroy());
    this.#commentPresenterList.clear();
  };

  #deleteComment = (commentId) => {
    this.#handleViewAction(UserAction.DELETE_COMMENT, UpdateType.MAJOR, commentId);
  };

  #addComment = (newComment) => {
    this.#handleViewAction(UserAction.ADD_COMMENT, UpdateType.MAJOR, newComment);
  };

  #shakeNewComment = () => {
    this.#popupNewCommentComponent.shake();
  };
}
