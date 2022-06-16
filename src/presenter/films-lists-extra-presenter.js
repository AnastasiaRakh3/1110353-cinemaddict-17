import FilmsExtraListView from '../view/films-extra-view.js';
import { render } from '../framework/render.js';
import { sortCardRating, sortCardMostCommented } from '../utils/card.js';
import { Extra } from '../const.js';
import FilmPresenter from './film-presenter.js';

const CARDS_SHOWN_IN_EXTRA_SECTION = 2;

export default class FilmsListExtraPresenter {
  #renderingPlace = null;
  #title = null;
  #cardsModel = null;
  #changeMode = null;

  #filmsExtraListComponent = null;
  #filmsExtraPresenterList = new Map();

  constructor(renderingPlace, title, cardsModel, changeMode) {
    this.#renderingPlace = renderingPlace;
    this.#title = title;
    this.#cardsModel = cardsModel;
    this.#changeMode = changeMode;
  }

  get extraCards() {
    switch (this.#title) {
      case Extra.TOP_RATED:
        return [...this.#cardsModel].sort(sortCardRating).slice(0, CARDS_SHOWN_IN_EXTRA_SECTION);
      case Extra.MOST_COMMENTED:
        return [...this.#cardsModel].sort(sortCardMostCommented).slice(0, CARDS_SHOWN_IN_EXTRA_SECTION);
    }
    return [...this.#cardsModel].slice(0, CARDS_SHOWN_IN_EXTRA_SECTION);
  }

  #changeData = () => {
  };

  #renderExtraCards = () => {
    this.extraCards.forEach((card) => this.#filmsExtraPresenterList.set(card.id, new FilmPresenter(this.#filmsExtraListComponent, this.#changeData, this.#changeMode)));
    this.#filmsExtraPresenterList.forEach((presenter) => {});
  };

  #renderFilmsListExtra = () => {
    this.#filmsExtraListComponent = new FilmsExtraListView(this.#title);
    render(this.#filmsExtraListComponent, this.#renderingPlace);
  };

  init = () => {
    this.#renderFilmsListExtra();
  };
}