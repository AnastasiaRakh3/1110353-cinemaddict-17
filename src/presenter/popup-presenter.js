import PopupView from '../view/popup-view.js';
import {render} from '../render.js';

export default class PopupPresenter {

  init = (CommentsContainer, PopupModel) => {
    this.commentsContainer = CommentsContainer;
    this.popupModel = PopupModel.getPopup();

    render(new PopupView(this.popupModel), this.commentsContainer);
  };
}
