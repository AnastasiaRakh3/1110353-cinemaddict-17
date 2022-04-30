import {createElement} from '../render.js';
import {humanizeCommentDate} from '../utils.js';

const createPopupCommentTemplate = (commentElement) => {
  // Пока не вставляла id
  const {author, comment, date, emotion} = commentElement;
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
      <button class="film-details__comment-delete">Delete</button>
    </p>
  </div>
  </li>`;
};

export default class PopupCommentView {
  constructor(comment) {
    this.comment = comment;
  }

  getTemplate() {
    return createPopupCommentTemplate(this.comment);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
