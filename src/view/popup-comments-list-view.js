import AbstractView from '../framework/view/abstract-view.js';

const createPopupCommentsListTemplate = (commentsCount) => `<div class="film-details__bottom-container">
  <section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>

    <ul class="film-details__comments-list">
    </ul>

  </section>
</div>`;

export default class PopupCommentsListView extends AbstractView {
  #commentsCount = null;

  constructor(commentsCount) {
    super();
    this.#commentsCount = commentsCount;
  }

  get template() {
    return createPopupCommentsListTemplate(this.#commentsCount);
  }

  setDeleteButtonClickHandler = (callback) => {
    this._callback.commentDeleteClick = callback;
    this.element.querySelector('.film-details__comments-list').addEventListener('click', this.#commentDeleteClickHandler);
  };

  #commentDeleteClickHandler = (evt) => {
    evt.stopPropagation();
    this._callback.commentDeleteClick(evt.target.dataset.commentId);
  };
}
