import PopupCommentView from '../view/popup-comment-view';
import { render, remove } from '../framework/render';

export default class CommentPresenter {
  #commentData = null;
  #renderingPlace = null;
  #commentComponent = null;

  constructor(renderingPlace) {
    this.#renderingPlace = renderingPlace;
  }

  init = (commentData) => {
    this.#commentData = commentData;
    this.#commentComponent = new PopupCommentView(this.#commentData);
    render(this.#commentComponent, this.#renderingPlace);
  };

  destroy = () => {
    remove(this.#commentComponent);
  };
}
