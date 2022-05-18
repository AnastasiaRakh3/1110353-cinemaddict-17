import {render, remove} from '../framework/render.js';
// import {render, remove, replace} from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';
import PopupView from '../view/popup-view.js';
import CommentsModel from '../model/comments-model.js';
import CommentsPresenter from './comments-presenter.js';

const bodyElement = document.querySelector('body');
const commentsPresenter = new CommentsPresenter();

export default class FilmPresenter {
  #filmListContainer = null;
  #changeData = null;
  #card = null;
  #cardComponent = null;
  #popupComponent = null;
  #bodyComponent = bodyElement;

  constructor(filmListContainer, changeData) {
    this.#filmListContainer = filmListContainer;
    this.#changeData = changeData;
  }

  init = (card) => {
    this.#card = card;

    const prevСardComponent = this.#cardComponent;
    const prevPopupComponent = this.#popupComponent;

    this.#cardComponent = new FilmCardView(card);
    this.#popupComponent = new PopupView(card);

    this.#cardComponent.setClickHandler(this.#handleCardClick);
    this.#cardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    this.#popupComponent.setPopupCloseClickHandler(this.#handlePopupCloseClick);

    if (prevСardComponent === null || prevPopupComponent === null) {
      render(this.#cardComponent, this.#filmListContainer);
    }

    // if (this.#filmListContainer.contains(prevСardComponent.element)) {
    //   replace(this.#cardComponent, prevСardComponent);
    // }

    // if (this.#bodyComponent.contains(prevPopupComponent.element)) {
    //   replace(this.#popupComponent, prevPopupComponent);
    // }

    remove(prevСardComponent);
    remove(prevPopupComponent);
  };

  destroy = () => {
    remove(this.#cardComponent);
    remove(this.#popupComponent);
  };

  #openPopup = () => {
    this.#bodyComponent.appendChild(this.#popupComponent.element);
    bodyElement.classList.add('hide-overflow');
    const commentsList = this.#popupComponent.element.querySelector('.film-details__comments-list');
    commentsPresenter.init(commentsList, new CommentsModel());
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  #closePopup = () => {
    this.#bodyComponent.removeChild(this.#popupComponent.element);
    bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closePopup();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #handleFavoriteClick = () => {
    this.#changeData({...this.#card, isFavorite: !this.#card.userDetails.favorite});
  };

  #handleCardClick = () => {
    this.#openPopup();
  };

  #handlePopupCloseClick = () => {
    this.#closePopup();
  };

  // #handlePopupCloseClick = (card) => {
  //   this.#changeData(card);
  //   this.#closePopup();
  // };
}
