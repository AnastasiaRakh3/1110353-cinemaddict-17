import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { Emotion } from '../const.js';
import he from 'he';

// Чтобы гарантировать порядок эмоджи
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
    // В нем будет объект с новыми значениями ключей
    this._state = PopupNewCommentView.parseCommentToState(comment);

    this.#setInnerHandlers();
  }

  get template() {
    return createPopupNewCommentTemplate(this._state);
  }

  #emojiChooseHandler = (evt) => {
    const targetInput = evt.target;
    // Обновляем объект новыми свойствами и перерисовываем элемент
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
    // Добавляем в объект новые свойства
    this._setState({
      localComment: targetInput.value,
    });
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('input', this.#emojiChooseHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('keydown', this.#commentAddHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentInputHandler);
  };

  // Добавляем в объект новые свойства, значение которых потом при parseStateToComment присвоим другим ключам: comment и emotion
  static parseCommentToState = (comment) => ({
    ...comment,
    localComment: '',
    localEmotion: null,
  });

  // Присвоим нужным ключам (comment и emotion), значение свойств тех ключей, с которыми работали (localComment, localEmotion)
  // Если localComment, localEmotion пустые, то по умол. передаем пустую строку и дефолтный смайл
  // Удаляем их: localComment, localEmotion
  // Возвращаем объект с возможно изменеными значениями свойств

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
