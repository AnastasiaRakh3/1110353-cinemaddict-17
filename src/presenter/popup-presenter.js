import PopupCommentView from '../view/popup-comment-view.js';
import {render} from '../render.js';

export default class CommentsPresenter {

  init = (CommentsContainer, CommentsModel) => {
    this.CommentsContainer = CommentsContainer;
    this.CommentsModel = CommentsModel;
    this.blockComments = [...this.CommentsModel.getComments()];

    for (let i = 0; i < this.blockComments.length; i++) {
      render(new PopupCommentView(this.blockComments[i]), this.CommentsContainer);
    }
  };
}
