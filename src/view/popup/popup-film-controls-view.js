import AbstractView from '../../framework/view/abstract-view.js';
import { getDisabledState } from '../../utils/other';

const createPopupFilmControls = (filmCard, isControlsDisabled) => {
  const { userDetails: { watchlist, alreadyWatched, favorite } } = filmCard;

  const inWatchListClassName = watchlist ? 'film-details__control-button--active' : '';
  const inAlreadyWatchedClassName = alreadyWatched ? 'film-details__control-button--active' : '';
  const inFavoriteClassName = favorite ? 'film-details__control-button--active' : '';

  return ` <section class="film-details__controls">
  <button type="button" class="film-details__control-button film-details__control-button--watchlist ${inWatchListClassName}" id="watchlist" name="watchlist" ${getDisabledState(isControlsDisabled)}>Add to watchlist</button>
  <button type="button" class="film-details__control-button film-details__control-button--watched ${inAlreadyWatchedClassName}" id="watched" name="watched" ${getDisabledState(isControlsDisabled)}>Already watched</button>
  <button type="button" class="film-details__control-button film-details__control-button--favorite ${inFavoriteClassName}" id="favorite" name="favorite" ${getDisabledState(isControlsDisabled)}>Add to favorites</button>
</section>`;
};

export default class PopupFilmControls extends AbstractView {
  #filmCard = null;
  #isControlsDisabled = false;

  constructor(filmCard, isControlsDisabled) {
    super();
    this.#filmCard = filmCard;
    this.#isControlsDisabled = isControlsDisabled;
  }

  get template() {
    return createPopupFilmControls(this.#filmCard, this.#isControlsDisabled);
  }

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  setAlreadyWatchedClickHandler = (callback) => {
    this._callback.alreadyWatchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#alreadyWatchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  #watchlistClickHandler = () => {
    this._callback.watchlistClick();
  };

  #alreadyWatchedClickHandler = () => {
    this._callback.alreadyWatchedClick();
  };

  #favoriteClickHandler = () => {
    this._callback.favoriteClick();
  };
}
