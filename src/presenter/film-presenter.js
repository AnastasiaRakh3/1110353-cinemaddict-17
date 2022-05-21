import {render, remove, replace} from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';
import PopupView from '../view/popup-view.js';
import CommentsModel from '../model/comments-model.js';
import CommentsPresenter from './comments-presenter.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'WATCHING',
};

const bodyElement = document.querySelector('body');
const commentsPresenter = new CommentsPresenter();

export default class FilmPresenter {
  #filmListContainer = null;
  #changeData = null;
  #changeMode = null;

  #card = null;
  #mode = Mode.DEFAULT;

  #cardComponent = null;
  #popupComponent = null;
  #bodyComponent = bodyElement;

  constructor(filmListContainer, changeData, changeMode) {
    this.#filmListContainer = filmListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (card) => {
    this.#card = card;

    const prevCardComponent = this.#cardComponent;
    const prevPopupComponent = this.#popupComponent;

    this.#cardComponent = new FilmCardView(card);
    this.#popupComponent = new PopupView(card);

    this.#cardComponent.setClickHandler(this.#handleCardClick);
    this.#cardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#cardComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#cardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    this.#popupComponent.setPopupCloseClickHandler(this.#handlePopupCloseClick);

    // Проверка на первую отрисовку
    if (prevCardComponent === null || prevPopupComponent === null) {
      render(this.#cardComponent, this.#filmListContainer);
      return;
    }

    // if (this.#filmListContainer.contains(prevCardComponent.element)) {
    //   replace(this.#cardComponent, prevCardComponent);
    // }

    // if (this.#bodyComponent.contains(prevPopupComponent.element)) {
    //   replace(this.#popupComponent, prevPopupComponent);
    // }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#cardComponent, prevCardComponent);
    }

    if (this.#mode === Mode.WATCHING) {
      replace(this.#popupComponent, prevPopupComponent);
    }

    remove(prevCardComponent);
    remove(prevPopupComponent);
  };

  destroy = () => {
    remove(this.#cardComponent);
    remove(this.#popupComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#closePopup();
    }
  };

  #openPopup = () => {
    this.#bodyComponent.appendChild(this.#popupComponent.element);
    bodyElement.classList.add('hide-overflow');
    const commentsList = this.#popupComponent.element.querySelector('.film-details__comments-list');
    commentsPresenter.init(commentsList, new CommentsModel());
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#changeMode();
    this.#mode = Mode.WATCHING;
  };

  #closePopup = () => {
    this.#bodyComponent.removeChild(this.#popupComponent.element);
    bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.DEFAULT;
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closePopup();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #handleWatchlistClick = () => {
    this.#changeData({...this.#card,
      userDetails: {
        ...this.#card.userDetails,
        watchlist: !this.#card.userDetails.watchlist,}
    });
  };

  #handleAlreadyWatchedClick = () => {
    this.#changeData({...this.#card,
      userDetails: {
        ...this.#card.userDetails,
        alreadyWatched: !this.#card.userDetails.alreadyWatched,}
    });
  };

  #handleFavoriteClick = () => {
    this.#changeData({...this.#card,
      userDetails: {
        ...this.#card.userDetails,
        favorite: !this.#card.userDetails.favorite,}
    });
  };

  #handleCardClick = () => {
    this.#openPopup();
  };

  #handlePopupCloseClick = () => {
    this.#closePopup();
  };
}
