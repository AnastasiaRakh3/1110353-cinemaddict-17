import FilmsBlockView from '../view/films-block-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import LoadMoreButtonView from '../view/loadmore-button-view.js';
import FilmCardView from '../view/film-card-view.js';
import PopupView from '../view/popup-view.js';
import { render, RenderPosition } from '../render.js';
import CommentsPresenter from './comments-presenter.js';
import CommentsModel from '../model/comments-model.js';

const CARD_COUNT_PER_STEP = 5;
const siteMainElement = document.querySelector('.main');
const bodyElement = document.querySelector('body');
const commentsPresenter = new CommentsPresenter();

class FilmsPresenter {
  #filmsBlockComponent = new FilmsBlockView();
  #filmsListComponent = new FilmsListView();
  #filmsListContainerComponent = new FilmsListContainerView();
  #loadMoreButtonComponent = new LoadMoreButtonView();
  #filmCards = [];
  #renderedCardCount = CARD_COUNT_PER_STEP;

  #filmsBlockContainer = null;
  #filmCardsModel = null;

  constructor(filmsBlockContainer, filmCardsModel) {
    this.#filmsBlockContainer = filmsBlockContainer;
    this.#filmCardsModel = filmCardsModel;
  }

  init = () => {
    this.#filmCards = [...this.#filmCardsModel.filmCards];
    this.#renderCards();

    if(this.#filmCards.length === 0) {
      const filmsTitle = this.#filmsListComponent.element.querySelector('.films-list__title');
      filmsTitle.classList.remove('visually-hidden');
      filmsTitle.textContent = 'There are no movies in our database';
    }
  };

  #onLoadMoreButtonClick = () => {
    const moreCards = this.#filmCards.slice(
      this.#renderedCardCount,
      this.#renderedCardCount + CARD_COUNT_PER_STEP
    );
    moreCards.forEach((card) => this.#renderFilmCard(card));
    this.#renderedCardCount += CARD_COUNT_PER_STEP;

    if (this.#renderedCardCount >= this.#filmCards.length) {
      this.#loadMoreButtonComponent.element.remove();
      this.#loadMoreButtonComponent.removeElement();
    }
  };

  #renderFilmCard = (card) => {
    const cardComponent = new FilmCardView(card);
    const popupComponent = new PopupView(card);
    const siteMainComponent = siteMainElement;

    const openPopup = () => {
      siteMainComponent.appendChild(popupComponent.element);
      bodyElement.classList.add('hide-overflow');
      const commentsList = popupComponent.element.querySelector('.film-details__comments-list');
      commentsPresenter.init(commentsList, new CommentsModel());
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

  #renderCards = () => {
    render(this.#filmsBlockComponent, this.#filmsBlockContainer);
    render(this.#filmsListComponent, this.#filmsBlockComponent.element, RenderPosition.AFTERBEGIN);
    render(this.#filmsListContainerComponent, this.#filmsListComponent.element);

    for (let i = 0; i < Math.min(this.#filmCards.length, CARD_COUNT_PER_STEP); i++) {
      this.#renderFilmCard(this.#filmCards[i]);
    }

    if (this.#filmCards.length > CARD_COUNT_PER_STEP) {
      render(this.#loadMoreButtonComponent, this.#filmsListComponent.element);
      this.#loadMoreButtonComponent.element.addEventListener('click', this.#onLoadMoreButtonClick);
    }
  };
}

export { siteMainElement, FilmsPresenter };
