import AbstractView from '../../framework/view/abstract-view.js';
import { displayRelativeTimeDate } from '../../utils/datetime.js';
import { getDisabledState } from '../../utils/other.js';

const createPopupCommentTemplate = (commentElement, isDeleting) => {
  const { id, author, comment, date, emotion } = commentElement;
  const deleteButtonText = isDeleting ? 'Deleting...' : 'Delete';

  return `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
  </span>
  <div>
    <p class="film-details__comment-text">${comment}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${author}</span>
      <span class="film-details__comment-day">${displayRelativeTimeDate(date)}</span>
      <button class="film-details__comment-delete" data-comment-id="${id}" ${getDisabledState(isDeleting)}>${deleteButtonText}</button>
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
