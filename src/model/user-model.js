import Observable from '../framework/observable';
import { UserStatus } from '../const';

export default class UserModel extends Observable {
  #userStatus = UserStatus.NO_STATUS;

  get userStatus() {
    return this.#userStatus;
  }

  setUserStatus = (updateType, userStatus) => {
    this.#userStatus = userStatus;
    this._notify(updateType, userStatus);
  };
}
