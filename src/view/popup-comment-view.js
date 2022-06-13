import AbstractView from '../framework/view/abstract-view.js';
import {humanizeCommentDate} from '../utils/card.js';

const createPopupCommentTemplate = (commentElement) => {
  const {id, author, comment, date, emotion} = commentElement;
  const commentDate = humanizeCommentDate(date);

  return `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
  </span>
  <div>
    <p class="film-details__comment-text">${comment}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${author}</span>
      <span class="film-details__comment-day">${commentDate}</span>
      <button class="film-details__comment-delete" data-comment-id="${id}">Delete</button>
    </p>
  </div>
  </li>`;
};

export default class PopupCommentView extends AbstractView {
  #comment = null;

  constructor(comment) {
    super();
    this.#comment = comment;
  }

  get template() {
    return createPopupCommentTemplate(this.#comment);
  }
}
