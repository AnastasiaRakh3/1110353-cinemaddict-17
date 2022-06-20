import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';
import { Emotion } from '../../const.js';
import he from 'he';

const EmojiOrder = [Emotion.SMILE, Emotion.SLEEPING, Emotion.PUKE, Emotion.ANGRY];

const createPopupNewCommentTemplate = (state) => {
  const getSelectedEmojiPicture = () => state.localEmotion !== null ? `<img src="images/emoji/${state.localEmotion}.png" width="55" height="55" alt="emoji-${state.localEmotion}">` : '';
  const checkIsEmojiSelected = (emoji) => emoji === state.localEmotion ? 'checked' : '';

  const createListElement = (emoji) => `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${checkIsEmojiSelected(emoji)}>
  <label class="film-details__emoji-label" for="emoji-${emoji}">
    <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
  </label>`;

  return `<div class="film-details__new-comment">
  <div class="film-details__add-emoji-label">${getSelectedEmojiPicture()}</div>

  <label class="film-details__comment-label">
    <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${he.encode(state.localComment)}</textarea>
  </label>
  <div class="film-details__emoji-list">
  ${EmojiOrder.map((emoji) => createListElement(emoji)).join('')}
  </div>
  </div>`;
};

export default class PopupNewCommentView extends AbstractStatefulView {
  constructor(comment) {
    super();

    this._state = PopupNewCommentView.parseCommentToState(comment);
    this.#setInnerHandlers();
  }

  get template() {
    return createPopupNewCommentTemplate(this._state);
  }

  #emojiChooseHandler = (evt) => {
    const targetInput = evt.target;
    this.updateElement({
      localEmotion: targetInput.value,
    });
  };

  #commentAddHandler = (evt) => {
    if (evt.keyCode === 13 && evt.ctrlKey) {
      this._callback.commentAddKeyDown(PopupNewCommentView.parseStateToComment(this._state));
    }
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
  };

  #commentInputHandler = (evt) => {
    const targetInput = evt.target;
    this._setState({
      localComment: targetInput.value,
    });
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('input', this.#emojiChooseHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('keydown', this.#commentAddHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentInputHandler);
  };

  static parseCommentToState = (comment) => ({
    ...comment,
    localComment: '',
    localEmotion: null,
  });

  static parseStateToComment = (state) => {
    const commentData = { ...state };

    commentData.comment = commentData.localComment;

    if (!commentData.localEmotion) {
      commentData.emotion = Emotion.SMILE;
    } else {
      commentData.emotion = commentData.localEmotion;
    }

    delete commentData.localComment;
    delete commentData.localEmotion;
    return commentData;
  };

  setAddCommentKeyDownHandler = (callback) => {
    this._callback.commentAddKeyDown = callback;
  };
}
