import UserView from '../view/user-view';
import { render, remove, replace } from '../framework/render';
import { UserStatus } from '../const';

export default class UserPresenter {
  #userModel = null;
  #cardsModel = null;
  #renderingPlace = null;

  #userComponent = null;

  constructor(renderingPlace, cardsModel, userModel) {
    this.#renderingPlace = renderingPlace;
    this.#cardsModel = cardsModel;
    this.#userModel = userModel;
  }

  #getUserStatus = (cards) => {
    const watchedFilmsAmount = cards.filter((card) => card.userDetails.alreadyWatched).length;
    if( watchedFilmsAmount >= 1 && watchedFilmsAmount <= 10) {
      return UserStatus.NOVICE;
    } else if (watchedFilmsAmount >= 11 && watchedFilmsAmount <= 20) {
      return UserStatus.FAN;
    } else if (watchedFilmsAmount >= 21) {
      return UserStatus.MOVIE_BUFF;
    } else {
      return '';
    }
  };

  init = () => {
    const prevUserComponent = this.#userComponent;

    this.#userComponent = new UserView(this.#getUserStatus(this.#cardsModel.filmCards));

    if (prevUserComponent === null) {
      render(this.#userComponent, this.#renderingPlace);
      return;
    }

    replace(this.#userComponent, prevUserComponent);
    remove(prevUserComponent);

  };
}
