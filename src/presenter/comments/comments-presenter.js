import PopupCommentsListView from '../../view/popup/popup-comments-list-view.js';
import PopupNewCommentView from '../../view/popup/popup-new-comment.js';
import CommentPresenter from './comment-presenter.js';
import { UserAction, UpdateType } from '../../const.js';
import { remove, render, RenderPosition } from '../../framework/render.js';
import { uiBlockerInstance } from '../../utils/ui-blocker.js';

export default class CommentsPresenter {
  #commentsModel = null;
  #commentsContainer = null;

  #popupCommentsListComponent = null;
  #popupNewCommentComponent = null;
  #uiBlocker = uiBlockerInstance;
  #commentPresenterList = new Map();

  constructor(commentsModel, commentsContainer) {
    this.#commentsModel = commentsModel;
    this.#commentsContainer = commentsContainer;
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

  #renderComments = () => {
    const commentsContainerElement = this.#popupCommentsListComponent.element.querySelector('.film-details__comments-list');

    for (const comment of this.commentsList) {
      const commentPresenter = new CommentPresenter(commentsContainerElement);
      commentPresenter.init(comment);
      this.#commentPresenterList.set(comment.id, commentPresenter);
    }
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
