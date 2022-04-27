import FilmsBlockView from '../view/films-block.view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import LoadMoreButtonView from '../view/loadmore-button-view.js';
import FilmCardView from '../view/filmcard-view.js';
import {render} from '../render.js';

export default class FilmsPresenter {
  filmsBlockComponent = new FilmsBlockView();
  filmsListComponent = new FilmsListView();
  filmsListContainerComponent = new FilmsListContainerView();
  LoadMoreButtonComponent = new LoadMoreButtonView();

  init = (filmsBlockContainer) => {
    this.filmsBlockContainer = filmsBlockContainer;

    render(this.filmsBlockComponent, this.filmsBlockContainer, 'beforeend');
    render(this.filmsListComponent, this.filmsBlockComponent.getElement(), 'afterbegin');
    render(this.filmsListContainerComponent, this.filmsListComponent.getElement(), 'beforeend');

    for (let i = 0; i < 5; i++) {
      render(new FilmCardView(), this.filmsListContainerComponent.getElement(), 'beforeend');
    }

    render(this.LoadMoreButtonComponent, this.filmsListComponent.getElement(), 'beforeend');
  };
}
