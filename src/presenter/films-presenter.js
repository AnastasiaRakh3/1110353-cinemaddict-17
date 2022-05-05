import FilmsBlockView from '../view/films-block-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import LoadMoreButtonView from '../view/loadmore-button-view.js';
import FilmCardView from '../view/film-card-view.js';
import PopupView from '../view/popup-view.js';
import {render, RenderPosition} from '../render.js';

const siteMainElement = document.querySelector('.main');
const bodyElement = document.querySelector('body');

class FilmsPresenter {
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
      this.#renderFilmCard(this.#filmCards[i]);
    }

    render(this.#loadMoreButtonComponent, this.#filmsListComponent.element);
  };

  #renderFilmCard = (card) => {
    const cardComponent = new FilmCardView(card);
    const popupComponent = new PopupView(card);
    const siteMainComponent = siteMainElement;

    const openPopup = () => {
      siteMainComponent.appendChild(popupComponent.element);
      bodyElement.classList.add('hide-overflow');
    };

    const closePopup = () => {
      siteMainComponent.removeChild(popupComponent.element);
      bodyElement.classList.remove('hide-overflow');
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        closePopup();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    cardComponent.element.addEventListener('click', () => {
      openPopup();
      document.addEventListener('keydown', onEscKeyDown);
    });

    popupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', () => {
      closePopup();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(cardComponent, this.#filmsListContainerComponent.element);
  };
}

export {siteMainElement, FilmsPresenter};
