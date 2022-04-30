import {createElement} from '../render.js';
import {humanizeFilmDate} from '../utils.js';

const createFilmCardTemplate = (filmCard) => {
  const {filmInfo: {title, totalRating, poster, release: {date}, runtime, genre, description}, userDetails: {watchlist, alreadyWatched, favorite}} = filmCard;

  const inWatchListClassName = watchlist ? 'film-card__controls-item--active' : '';
  const inAlreadyWatchedClassName = alreadyWatched ? 'film-card__controls-item--active' : '';
  const inFavoriteClassName = favorite ? 'film-card__controls-item--active' : '';
  const releaseFilmDate = humanizeFilmDate(date);

  return `<article class="film-card">
  <a class="film-card__link">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${releaseFilmDate}</span>
      <span class="film-card__duration">${runtime}</span>
      <span class="film-card__genre">${genre}</span>
    </p>
    <img src="${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${description}</p>
    <span class="film-card__comments">5 comments</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${inWatchListClassName}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${inAlreadyWatchedClassName}" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${inFavoriteClassName}" type="button">Mark as favorite</button>
  </div>
  </article>`;
};

export default class FilmCard {
  constructor(filmCard) {
    this.filmCard = filmCard;
  }

  getTemplate() {
    return createFilmCardTemplate(this.filmCard);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
