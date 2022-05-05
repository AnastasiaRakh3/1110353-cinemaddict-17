import FilmsBlockView from '../view/films-block-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import LoadMoreButtonView from '../view/loadmore-button-view.js';
import FilmCardView from '../view/film-card-view.js';
import {render, RenderPosition} from '../render.js';

export default class FilmsPresenter {
  #filmsBlockComponent = new FilmsBlockView();
  #filmsListComponent = new FilmsListView();
  #filmsListContainerComponent = new FilmsListContainerView();
  #loadMoreButtonComponent = new LoadMoreButtonView();
  #filmCards = [];

  #filmsBlockContainer = null;
  #filmCardsModel = null;

  init = (filmsBlockContainer, filmCardsModel) => {
    this.#filmsBlockContainer = filmsBlockContainer;
    this.#filmCardsModel = filmCardsModel;
    this.#filmCards = [...this.#filmCardsModel.filmCards];

    render(this.#filmsBlockComponent, this.#filmsBlockContainer);
    render(this.#filmsListComponent, this.#filmsBlockComponent.element, RenderPosition.AFTERBEGIN);
    render(this.#filmsListContainerComponent, this.#filmsListComponent.element);

    for (let i = 0; i < this.#filmCards.length; i++) {
      render(new FilmCardView(this.#filmCards[i]), this.#filmsListContainerComponent.element);
    }

    render(this.#loadMoreButtonComponent, this.#filmsListComponent.element);
  };
}
