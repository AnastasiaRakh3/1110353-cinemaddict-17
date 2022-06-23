import AbstractView from '../../framework/view/abstract-view.js';

const createPopupCommentsListTitleTemplate = (commentsCount) => `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>`;

export default class PopupCommentsListTitleView extends AbstractView {
  #commentsCount = null;

  constructor(commentsCount) {
    super();
    this.#commentsCount = commentsCount;
  }

  get template() {
    return createPopupCommentsListTitleTemplate(this.#commentsCount);
  }
}
