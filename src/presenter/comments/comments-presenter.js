import PopupCommentsListView from '../../view/popup/popup-comments-list-view.js';
import PopupNewCommentView from '../../view/popup/popup-new-comment.js';
import PopupCommentsListTitleView from '../../view/popup/popup-comments-list-title-view.js';
import CommentPresenter from './comment-presenter.js';
import { UserAction, UpdateType } from '../../const.js';
import { remove, render, RenderPosition, replace } from '../../framework/render.js';
import { uiBlockerInstance } from '../../utils/ui-blocker.js';

export default class CommentsPresenter {
  #commentsModel = null;

  #popupCommentsListComponent = null;
  #popupCommentsListTitleComponent = null;
  #popupNewCommentComponent = null;
  #commentsListElement = null;
  #commentsContainerElement = null;
  #uiBlocker = uiBlockerInstance;
  #commentPresenterList = new Map();
  #isNewCommentDisabled = false;

  constructor(commentsModel) {
    this.#commentsModel = commentsModel;

    this.#commentsModel.addObserver(this.#handleComentsModelChange);
  }

  get commentsList() {
    return [...this.#commentsModel.filmComments];
  }

  init = (commentsContainerElement = null) => {
    const prevPopupCommentsListComponent = this.#popupCommentsListComponent;

    if (commentsContainerElement !== null) {
      this.#commentsContainerElement = commentsContainerElement;
    }

    this.#popupCommentsListComponent = new PopupCommentsListView();
    this.#commentsListElement = this.#popupCommentsListComponent.element.querySelector('.film-details__comments-list');

    this.#renderCommentsTitle();
    this.#renderComments();
    this.#renderNewCommentView();

    this.#popupCommentsListComponent.setDeleteButtonClickHandler(this.#deleteComment);

    if (prevPopupCommentsListComponent !== null) {
      remove(prevPopupCommentsListComponent);
    }

    render(this.#popupCommentsListComponent, this.#commentsContainerElement, RenderPosition.AFTEREND);
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
          this.#setDisabledState();
          this.#renderNewCommentView(update);
          await this.#commentsModel.addComment(updateType, update);
        } catch {
          this.#shakeNewComment();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleComentsModelChange = (updateType, update) => {
    switch (updateType) {
      case UpdateType.MINOR:
        this.#commentPresenterList.get(update).destroy();
        this.#commentPresenterList.delete(update);
        this.#renderCommentsTitle();
        break;
      case UpdateType.MAJOR:
        this.#setDefaultState();
        this.#clearComments();
        this.#renderCommentsTitle();
        this.#renderComments();
        this.#renderNewCommentView();
        break;
    }
  };

  #renderCommentsTitle = () => {
    const prevPopupCommentsListTitleComponent = this.#popupCommentsListTitleComponent;
    this.#popupCommentsListTitleComponent = new PopupCommentsListTitleView(this.commentsList.length);

    if (prevPopupCommentsListTitleComponent !== null) {
      remove(prevPopupCommentsListTitleComponent);
    }

    render(this.#popupCommentsListTitleComponent, this.#popupCommentsListComponent.element.querySelector('.film-details__comments-wrap'), RenderPosition.AFTERBEGIN);
  };

  #renderNewCommentView = (newCommentState) => {
    const prevPopupNewCommentComponent = this.#popupNewCommentComponent;
    this.#popupNewCommentComponent = new PopupNewCommentView(this.#isNewCommentDisabled, newCommentState);
    this.#popupNewCommentComponent.setAddCommentKeyDownHandler(this.#addComment);

    if (newCommentState) {
      replace(this.#popupNewCommentComponent, prevPopupNewCommentComponent);
    } else {
      render(this.#popupNewCommentComponent, this.#popupCommentsListComponent.element, RenderPosition.BEFOREEND);
    }

    if (prevPopupNewCommentComponent !== null) {
      remove(prevPopupNewCommentComponent);
    }
  };

  #renderComment = (comment) => {
    const commentPresenter = new CommentPresenter(this.#commentsListElement);
    commentPresenter.init(comment);
    this.#commentPresenterList.set(comment.id, commentPresenter);
  };

  #renderComments = () => {
    for (const comment of this.commentsList) {
      this.#renderComment(comment);
    }
  };

  #clearComments = () => {
    this.#commentPresenterList.forEach((presenter) => presenter.destroy());
    this.#commentPresenterList.clear();
  };

  #deleteComment = (commentId) => {
    this.#handleViewAction(UserAction.DELETE_COMMENT, UpdateType.MINOR, commentId);
  };

  #addComment = (newComment) => {
    this.#handleViewAction(UserAction.ADD_COMMENT, UpdateType.MAJOR, newComment);
  };

  #shakeNewComment = () => {
    this.#popupNewCommentComponent.shake();
  };

  #setDisabledState = () => {
    this.#isNewCommentDisabled = true;

  };

  #setDefaultState = () => {
    this.#isNewCommentDisabled = false;
  };
}
