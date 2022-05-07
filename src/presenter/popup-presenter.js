import PopupView from '../view/popup-view.js';
import {render} from '../render.js';

export default class PopupPresenter {
  #commentsContainer = null;
  #popupModel = null;

  init = (commentsContainer, popupModel) => {
    this.#commentsContainer = commentsContainer;
    this.#popupModel = popupModel.popup;

    render(new PopupView(this.#popupModel), this.#commentsContainer);
  };
}
