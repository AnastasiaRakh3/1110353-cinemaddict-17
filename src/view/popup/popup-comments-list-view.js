import AbstractView from '../../framework/view/abstract-view.js';

const createPopupCommentsListTemplate = () => `<div class="film-details__bottom-container">
  <section class="film-details__comments-wrap">
    <ul class="film-details__comments-list">
    </ul>
  </section>
</div>`;

export default class PopupCommentsListView extends AbstractView {
  get template() {
    return createPopupCommentsListTemplate();
  }

  setDeleteButtonClickHandler = (callback) => {
    this._callback.commentDeleteClick = callback;
    this.element.querySelector('.film-details__comments-list').addEventListener('click', this.#commentDeleteClickHandler);
  };

  #commentDeleteClickHandler = (evt) => {
    if (evt.target.tagName !== 'BUTTON') {
      return;
    }

    evt.preventDefault();
    this._callback.commentDeleteClick(evt.target.dataset.commentId);
  };
}
