import AbstractView from '../../framework/view/abstract-view.js';
import { humanizePopupFilmDate, humanizeFilmRunTime } from '../../utils/datetime.js';
import { checkTotalRating } from '../../utils/other.js';

const createPopupTemplate = (filmCard) => {
  const { filmInfo: { title, alternativeTitle, totalRating, poster, ageRating, director, writers, actors, release: { date, releaseCountry }, runtime, genre, description } } = filmCard;

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${alternativeTitle}</h3>
              <p class="film-details__title-original">${title}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${checkTotalRating(totalRating)}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${humanizePopupFilmDate(date)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${humanizeFilmRunTime(runtime)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">
                <span class="film-details__genre">${genre.join('&emsp;')}</span>
              </td>
            </tr>
          </table>
          <p class="film-details__film-description">
          ${description}
          </p>
        </div>
      </div>
    </div>
  </form>
  </section>`;
};

export default class PopupView extends AbstractView {
  #filmCard = null;

  constructor(filmCard) {
    super();
    this.#filmCard = filmCard;
  }

  get template() {
    return createPopupTemplate(this.#filmCard);
  }

  setPopupCloseClickHandler = (callback) => {
    this._callback.popupCloseClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#popupCloseClickHandler);
  };

  #popupCloseClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.popupCloseClick(this.#filmCard);
  };
}
