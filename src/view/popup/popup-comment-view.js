import AbstractView from '../../framework/view/abstract-view';
import { displayRelativeTimeDate } from '../../utils/datetime.js';

const createPopupCommentTemplate = (commentElement, isDeleting) => {
  const { id, author, comment, date, emotion } = commentElement;
  const deleteButtonText = isDeleting ? 'Deleting...' : 'Delete';
  const inDisabledState = isDeleting ? 'disabled' : '';

  return `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
  </span>
  <div>
    <p class="film-details__comment-text">${comment}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${author}</span>
      <span class="film-details__comment-day">${displayRelativeTimeDate(date)}</span>
      <button class="film-details__comment-delete" data-comment-id="${id}" ${inDisabledState}>${deleteButtonText}</button>
    </p>
  </div>
  </li>`;
};

export default class PopupCommentView extends AbstractView {
  #comment = null;
  #isDeleting = false;

  constructor(comment, isDeleting) {
    super();
    this.#comment = comment;
    this.#isDeleting = isDeleting;
  }

  get template() {
    return createPopupCommentTemplate(this.#comment, this.#isDeleting);
  }
}