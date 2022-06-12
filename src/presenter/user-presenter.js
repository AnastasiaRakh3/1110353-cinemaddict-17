import UserView from '../view/user-view';
import { render, remove, replace } from '../framework/render';
import { UserStatus } from '../const';

export default class UserPresenter {
  #userModel = null;
  #cardsModel = null;
  #renderingPlace = null;

  #userComponent = null;
  #currentUserStatus = null;

  constructor(renderingPlace, cardsModel, userModel) {
    this.#renderingPlace = renderingPlace;
    this.#cardsModel = cardsModel;
    this.#userModel = userModel;

    this.#cardsModel.addObserver(this.#handleUserStatusChange);
  }

  get userStatus() {
    const watchedFilmsAmount = this.#cardsModel.filmCards.filter((card) => card.userDetails.alreadyWatched).length;
    if( watchedFilmsAmount >= 1 && watchedFilmsAmount <= 10) {
      return UserStatus.NOVICE;
    } else if (watchedFilmsAmount >= 11 && watchedFilmsAmount <= 20) {
      return UserStatus.FAN;
    } else if (watchedFilmsAmount >= 21) {
      return UserStatus.MOVIE_BUFF;
    } else {
      return UserStatus.NO_STATUS;
    }
  }

  init = () => {
    const prevUserComponent = this.#userComponent;
    this.#currentUserStatus = this.userStatus;
    this.#userComponent = new UserView(this.#currentUserStatus);

    if (prevUserComponent === null) {
      render(this.#userComponent, this.#renderingPlace);
      return;
    }

    replace(this.#userComponent, prevUserComponent);
    remove(prevUserComponent);

  };

  #handleUserStatusChange = () => {
    if (this.userStatus === this.#currentUserStatus) {
      return;
    }
    this.init();
  };
}
