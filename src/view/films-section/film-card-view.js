import AbstractView from '../../framework/view/abstract-view.js';
import { humanizeCardFilmDate, humanizeFilmRunTime } from '../../utils/datetime.js';
import { formatTotalRating, formatDescription, getDisabledState } from '../../utils/other.js';

const createFilmCardTemplate = (filmCard, isControlsDisabled) => {
  const { comments, filmInfo: { title, totalRating, poster, release: { date }, runtime, genre, description }, userDetails: { watchlist, alreadyWatched, favorite } } = filmCard;

  const inWatchListClassName = watchlist ? 'film-card__controls-item--active' : '';
  const inAlreadyWatchedClassName = alreadyWatched ? 'film-card__controls-item--active' : '';
  const inFavoriteClassName = favorite ? 'film-card__controls-item--active' : '';

  return `<article class="film-card">
  <a class="film-card__link">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${formatTotalRating(totalRating)}</p>
    <p class="film-card__info">
      <span class="film-card__year">${humanizeCardFilmDate(date)}</span>
      <span class="film-card__duration">${humanizeFilmRunTime(runtime)}</span>
      <span class="film-card__genre">${genre[0]}</span>
    </p>
    <img src="${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${formatDescription(description)}</p>
    <span class="film-card__comments">${comments.length} comments</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${inWatchListClassName}" type="button" ${getDisabledState(isControlsDisabled)}>Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${inAlreadyWatchedClassName}" type="button" ${getDisabledState(isControlsDisabled)}>Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${inFavoriteClassName}" type="button" ${getDisabledState(isControlsDisabled)}>Mark as favorite</button>
  </div>
  </article>`;
};

export default class FilmCard extends AbstractView {
  #filmCard = null;
  #isControlsDisabled = false;

  constructor(filmCard, isControlsDisabled) {
    super();
    this.#filmCard = filmCard;
    this.#isControlsDisabled = isControlsDisabled;
  }

  get template() {
    return createFilmCardTemplate(this.#filmCard, this.#isControlsDisabled);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#clickHandler);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  setAlreadyWatchedClickHandler = (callback) => {
    this._callback.alreadyWatchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#alreadyWatchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  };

  #alreadyWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.alreadyWatchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };
}
