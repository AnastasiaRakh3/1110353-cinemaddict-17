import {render, remove, replace} from '../framework/render.js';
import FilmCardView from '../view/film-card-view.js';
import PopupView from '../view/popup-view.js';
import CommentsModel from '../model/comments-model.js';
import CommentsPresenter from './comments-presenter.js';
import {UserAction, UpdateType} from '../const.js';
import { getTodayDate } from '../utils/card.js';
import CommentsApiService from '../api/comments-api-service.js';

const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';
const AUTHORIZATION = 'Basic hS2sfS445555552j';

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
  #commentsPresenter = null;
  #commentsModel = null;
  #cardsModel = null;
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

    this.#commentsModel = new CommentsModel(new CommentsApiService(END_POINT, AUTHORIZATION, this.#card.id));
    this.#commentsModel.init();
    this.#commentsPresenter = new CommentsPresenter(this.#commentsModel, this.#popupComponent.element.querySelector('.film-details__top-container'));

    this.#setAllHandlers();

    // Проверка на первую отрисовку
    if (prevCardComponent === null || prevPopupComponent === null) {
      render(this.#cardComponent, this.#filmListContainer);
      return;
    }

    // Если в режиме просмотра, то попап снова перерисовыватся
    if (this.#mode === Mode.WATCHING) {
      replace(this.#popupComponent, prevPopupComponent);
      this.#commentsPresenter.init();
    }

    replace(this.#cardComponent, prevCardComponent);

    remove(prevCardComponent);
    remove(prevPopupComponent);
  };

  destroy = () => {
    remove(this.#cardComponent);
    remove(this.#popupComponent);
  };

  // Метод закрывает открытый попап
  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#closePopup();
    }
  };

  #openPopup = () => {
    // ?? Где этот метод?
    this.#changeMode();
    this.#bodyComponent.appendChild(this.#popupComponent.element);
    bodyElement.classList.add('hide-overflow');
    this.#commentsPresenter.init();
    document.addEventListener('keydown', this.#onEscKeyDown);
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
    this.#changeData(UserAction.UPDATE_CARD,
      UpdateType.PATCH,
      {...this.#card,
        userDetails: {
          ...this.#card.userDetails,
          watchlist: !this.#card.userDetails.watchlist,}
      });
  };

  #handleAlreadyWatchedClick = () => {
    this.#changeData(UserAction.UPDATE_CARD,
      UpdateType.PATCH,
      {...this.#card,
        userDetails: {
          ...this.#card.userDetails,
          alreadyWatched: !this.#card.userDetails.alreadyWatched,
          watchingDate: !this.#card.userDetails.alreadyWatched? getTodayDate(): null,
        }
      });
  };

  //  Вызывает метод обновления данных с правильно измененным полем favorite (обновленная карточка)
  #handleFavoriteClick = () => {
    this.#changeData(UserAction.UPDATE_CARD,
      UpdateType.PATCH,
      {...this.#card,
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

  #setAllHandlers = () => {
    this.#cardComponent.setClickHandler(this.#handleCardClick);
    this.#cardComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#cardComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#cardComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    this.#popupComponent.setPopupCloseClickHandler(this.#handlePopupCloseClick);
    this.#popupComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#popupComponent.setAlreadyWatchedClickHandler(this.#handleAlreadyWatchedClick);
    this.#popupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
  };
}
