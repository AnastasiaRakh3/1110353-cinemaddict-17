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
    this.#commentsModel.init();

    this.#commentsModel.addObserver(this.#handleCommentsModelChange);
  }

  init = (card) => {
    this.#card = card;

    const prevCardComponent = this.#cardComponent;
    const prevPopupComponent = this.#popupComponent;

    this.#cardComponent = new FilmCardView(card);
    this.#popupComponent = new PopupView(card);
    this.#popupFilmControlsComponent = new PopupFilmControls(card);

    this.#renderPopupFilmControls();
    this.#setAllHandlers();

    if (prevCardComponent === null || prevPopupComponent === null) {
      render(this.#cardComponent, this.#filmListContainer);
      return;
    }

    if (this.#mode === Mode.WATCHING) {
      replace(this.#popupComponent, prevPopupComponent);
      this.#renderComments();
      this.#popupComponent.setPopupCloseClickHandler(this.#handlePopupCloseClick);
    }

    replace(this.#cardComponent, prevCardComponent);
    remove(prevCardComponent);
    remove(prevPopupComponent);
  };

  destroy = () => {
    remove(this.#cardComponent);
    remove(this.#popupComponent);
  };

  #renderComments = () => {
    this.#commentsPresenter = new CommentsPresenter(this.#commentsModel, this.#popupComponent.element.querySelector('.film-details__top-container'));
    this.#commentsPresenter.init();
  };

  #renderPopupFilmControls = () => {
    const filmControlsContainer = this.#popupComponent.element.querySelector('.film-details__top-container');
    render(this.#popupFilmControlsComponent, filmControlsContainer);
  };

  shakeFilm = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#cardComponent.shake();
    } else {
      this.#popupFilmControlsComponent.shake();
    }
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#closePopup();
    }
  };

  #openPopup = () => {
    this.#changeMode();
    render(this.#popupComponent, this.#bodyComponent);
    this.#popupComponent.setPopupCloseClickHandler(this.#handlePopupCloseClick);
    bodyElement.classList.add('hide-overflow');
    this.#renderComments();
    this.#renderPopupFilmControls();
    document.addEventListener('keydown', this.#onEscKeyDown);
    this.#mode = Mode.WATCHING;
  };

  #closePopup = () => {
    remove(this.#popupComponent);
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

  #handleCommentsModelChange = (updateType) => {
    switch (updateType) {
      case UpdateType.MAJOR:
        this.init({
          ...this.#card,
          comments: this.#commentsModel.filmComments.map((comment) => comment.id)
        });
        break;
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

  #setAllHandlers = () => {
    this.#cardComponent.setClickHandler(this.#handleCardClick);
    this.#cardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#cardComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#cardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    this.#popupFilmControlsComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#popupFilmControlsComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#popupFilmControlsComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
  };
}
