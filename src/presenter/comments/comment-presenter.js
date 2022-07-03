import PopupCommentView from '../../view/popup/popup-comment-view.js';
import { render, remove, replace } from '../../framework/render.js';

export default class CommentPresenter {
  #renderingPlace = null;

  #commentData = null;
  #commentComponent = null;
  #isDeleting = false;

  constructor(renderingPlace) {
    this.#renderingPlace = renderingPlace;
  }

  init = (commentData) => {
    this.#commentData = commentData;

    const prevCommentComponent = this.#commentComponent;
    this.#commentComponent = new PopupCommentView(this.#commentData, this.#isDeleting);

    if (prevCommentComponent === null) {
      render(this.#commentComponent, this.#renderingPlace);
      return;
    }

    replace(this.#commentComponent, prevCommentComponent);
    remove(prevCommentComponent);
  };

  destroy = () => {
    remove(this.#commentComponent);
  };

  setDeletingMode = () => {
    this.#isDeleting = true;
    this.init(this.#commentData);
  };

  setDefaultMode = () => {
    this.#isDeleting = false;
    this.init(this.#commentData);
  };
}
