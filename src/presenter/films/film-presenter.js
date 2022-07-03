import FilmCardView from '../../view/films-section/film-card-view.js';
import PopupView from '../../view/popup/popup-view.js';
import PopupFilmControls from '../../view/popup/popup-film-controls-view.js';
import CommentsModel from '../../model/comments-model.js';
import CommentsPresenter from '../comments/comments-presenter.js';
import CommentsApiService from '../../api/comments-api-service.js';
import { END_POINT, AUTHORIZATION } from '../../server-config.js';
import { UserAction, UpdateType } from '../../const.js';
import { getTodayDate } from '../../utils/datetime.js';
import { render, remove, replace } from '../../framework/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  WATCHING: 'WATCHING',
};

const bodyElement = document.querySelector('body');

export default class FilmPresenter {
  #filmListContainer = null;
  #changeData = null;
  #changeMode = null;

  #card = null;
  #mode = Mode.DEFAULT;
  #isControlsDisabled = false;
  #cardComponent = null;
  #popupComponent = null;
  #popupFilmControlsComponent = null;
  #commentsPresenter = null;
  #commentsModel = null;
  #bodyComponent = bodyElement;

  constructor(filmListContainer, changeData, changeMode, card) {
    this.#filmListContainer = filmListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#card = card;

    this.#commentsModel = new CommentsModel(new CommentsApiService(END_POINT, AUTHORIZATION, this.#card.id));
    this.#commentsPresenter = new CommentsPresenter(this.#commentsModel);

    this.#commentsModel.addObserver(this.#handleCommentsModelChange);
  }

  get cardId() {
    return this.#card.id;
  }

  get isOpened() {
    return this.#mode === Mode.WATCHING;
  }

  init = (card) => {
    this.#card = card;

    this.#renderFilmCard();

    if (this.isOpened) {
      this.#updatePopupFilmControls();
    }
  };

  destroy = () => {
    remove(this.#cardComponent);
    remove(this.#popupComponent);
  };

  resetView = () => {
    if (this.isOpened) {
      this.#closePopup();
    }
  };

  shakeFilm = () => {
    if (this.isOpened) {
      this.#popupFilmControlsComponent.shake();
    } else {
      this.#cardComponent.shake();
    }
  };

  removeCard = () => {
    remove(this.#cardComponent);
  };

  disableControls = () => {
    this.#isControlsDisabled = true;
    this.#updateFilmControls();
  };

  enableControls = () => {
    this.#isControlsDisabled = false;
    this.#updateFilmControls();
  };

  #handleCommentsModelChange = (updateType) => {
    switch (updateType) {
      case UpdateType.INIT:
        this.#renderComments();
        break;
      case UpdateType.MINOR:
      case UpdateType.MAJOR:
        this.#changeData(UserAction.ADD_COMMENT,
          UpdateType.PATCH, {
            ...this.#card,
            comments: this.#commentsModel.filmComments.map((comment) => comment.id)
          });
        break;
    }
  };

  #updateFilmControls = () => {
    if (this.isOpened) {
      this.#updatePopupFilmControls();
    }

    this.#renderFilmCard();
  };

  #renderComments = () => {
    this.#commentsPresenter.init(this.#popupComponent.element.querySelector('.film-details__top-container'));
  };

  #renderFilmCard = () => {
    const prevCardComponent = this.#cardComponent;
    this.#cardComponent = new FilmCardView(this.#card, this.#isControlsDisabled);

    this.#cardComponent.setClickHandler(this.#handleCardClick);
    this.#cardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#cardComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#cardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevCardComponent === null) {
      render(this.#cardComponent, this.#filmListContainer);
      return;
    }

    replace(this.#cardComponent, prevCardComponent);
    remove(prevCardComponent);
  };

  #renderPopup = () => {
    const prevPopupComponent = this.#popupComponent;
    this.#popupComponent = new PopupView(this.#card);
    this.#popupComponent.setPopupCloseClickHandler(this.#handlePopupCloseClick);

    this.#renderPopupFilmControls();

    if (prevPopupComponent === null) {
      render(this.#popupComponent, this.#bodyComponent);
      return;
    }

    replace(this.#popupComponent, prevPopupComponent);
    remove(prevPopupComponent);
  };

  #updatePopupFilmControls = () => {
    const prevPopupFilmControlsComponent = this.#popupFilmControlsComponent;

    this.#createNewPopupFilmControlsComponent();

    replace(this.#popupFilmControlsComponent, prevPopupFilmControlsComponent);
    remove(prevPopupFilmControlsComponent);
  };

  #createNewPopupFilmControlsComponent = () => {
    this.#popupFilmControlsComponent = new PopupFilmControls(this.#card, this.#isControlsDisabled);
    this.#popupFilmControlsComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#popupFilmControlsComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#popupFilmControlsComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
  };

  #renderPopupFilmControls = () => {
    const prevPopupFilmControlsComponent = this.#popupFilmControlsComponent;
    const filmControlsContainerElement = this.#popupComponent.element.querySelector('.film-details__top-container');

    this.#createNewPopupFilmControlsComponent();

    if (prevPopupFilmControlsComponent !== null) {
      remove(prevPopupFilmControlsComponent);
    }

    render(this.#popupFilmControlsComponent, filmControlsContainerElement);
  };

  #openPopup = () => {
    this.#changeMode(this.#card.id);
    bodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#popupCloseEscKeyDownHandler);
    this.#renderPopup();
    this.#commentsModel.init();
    this.#mode = Mode.WATCHING;
  };

  #closePopup = () => {
    remove(this.#popupComponent);
    this.#popupComponent = null;
    this.#popupFilmControlsComponent = null;
    bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#popupCloseEscKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #popupCloseEscKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#closePopup();
      document.removeEventListener('keydown', this.#popupCloseEscKeyDownHandler);
    }
  };

  #handleWatchlistClick = () => {
    this.#changeData(UserAction.UPDATE_CARD,
      UpdateType.MINOR,
      {
        ...this.#card,
        userDetails: {
          ...this.#card.userDetails,
          watchlist: !this.#card.userDetails.watchlist,
        }
      });
  };

  #handleAlreadyWatchedClick = () => {
    this.#changeData(UserAction.UPDATE_CARD,
      UpdateType.MINOR,
      {
        ...this.#card,
        userDetails: {
          ...this.#card.userDetails,
          alreadyWatched: !this.#card.userDetails.alreadyWatched,
          watchingDate: !this.#card.userDetails.alreadyWatched ? getTodayDate() : null,
        }
      });
  };

  #handleFavoriteClick = () => {
    this.#changeData(UserAction.UPDATE_CARD,
      UpdateType.MINOR,
      {
        ...this.#card,
        userDetails: {
          ...this.#card.userDetails,
          favorite: !this.#card.userDetails.favorite,
        }
      });
  };

  #handleCardClick = () => {
    this.#openPopup();
  };

  #handlePopupCloseClick = () => {
    this.#closePopup();
  };
}
