import FilmsBlockView from '../view/films-block-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import LoadMoreButtonView from '../view/loadmore-button-view.js';
import FilmCardView from '../view/film-card-view.js';
import {render, RenderPosition} from '../render.js';

export default class FilmsPresenter {
  filmsBlockComponent = new FilmsBlockView();
  filmsListComponent = new FilmsListView();
  filmsListContainerComponent = new FilmsListContainerView();
  LoadMoreButtonComponent = new LoadMoreButtonView();

  init = (filmsBlockContainer) => {
    this.filmsBlockContainer = filmsBlockContainer;

    render(this.filmsBlockComponent, this.filmsBlockContainer);
    render(this.filmsListComponent, this.filmsBlockComponent.getElement(), RenderPosition.AFTERBEGIN);
    render(this.filmsListContainerComponent, this.filmsListComponent.getElement());

    for (let i = 0; i < 5; i++) {
      render(new FilmCardView(), this.filmsListContainerComponent.getElement());
    }

    render(this.LoadMoreButtonComponent, this.filmsListComponent.getElement());
  };
}
