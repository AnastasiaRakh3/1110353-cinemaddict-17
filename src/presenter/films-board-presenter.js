import { render, RenderPosition, remove } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import FilmsBlockView from '../view/films-block-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import LoadMoreButtonView from '../view/loadmore-button-view.js';
import FilmPresenter from './film-presenter.js';
import {updateItem} from '../utils/common.js';
import {sortCardUp, sortCardRating} from '../utils/card.js';
import {SortType} from '../const.js';

const CARD_COUNT_PER_STEP = 5;

export default class FilmsBoardPresenter {
  #filmsBlockContainer = null;
  #filmCardsModel = null;

  #sortComponent = new SortView();
  #filmsBlockComponent = new FilmsBlockView();
  #filmsListComponent = new FilmsListView();
  #filmsListContainerComponent = new FilmsListContainerView();
  #loadMoreButtonComponent = new LoadMoreButtonView();
  #filmCards = [];
  #renderedCardCount = CARD_COUNT_PER_STEP;
  #filmPresentersList = new Map();
  #currentSortType = SortType.DEFAULT;
  #sourcedBoardFilms = [];

  constructor(filmsBlockContainer, filmCardsModel) {
    this.#filmsBlockContainer = filmsBlockContainer;
    this.#filmCardsModel = filmCardsModel;
  }

  init = () => {
    this.#filmCards = [...this.#filmCardsModel.filmCards];
    this.#sourcedBoardFilms = [...this.#filmCardsModel.filmCards];
    this.#renderFilmsBoard();

    if (this.#filmCards.length === 0) {
      this.#renderNoCards();
    }
  };

  #handleLoadMoreButtonClick = () => {
    this.#renderFilms(this.#renderedCardCount, this.#renderedCardCount + CARD_COUNT_PER_STEP);
    this.#renderedCardCount += CARD_COUNT_PER_STEP;

    if (this.#renderedCardCount >= this.#filmCards.length) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  #handleModeChange = () => {
    this.#filmPresentersList.forEach((presenter) => presenter.resetView());
  };

  #handleFilmChange = (updatedCard) => {
    this.#filmCards = updateItem(this.#filmCards, updatedCard);
    this.#sourcedBoardFilms = updateItem(this.#sourcedBoardFilms, updatedCard);
    this.#filmPresentersList.get(updatedCard.id).init(updatedCard);
  };

  #sortCards = (sortType) => {
    // 2. Этот исходный массив задач необходим,
    // потому что для сортировки мы будем мутировать
    // массив в свойстве _boardTasks
    switch (sortType) {
      case SortType.DATE_UP:
        this.#filmCards.sort(sortCardUp);
        break;
      case SortType.RATING:
        this.#filmCards.sort(sortCardRating);
        break;
      default:
        // 3. А когда пользователь захочет "вернуть всё, как было",
        // мы просто запишем в _boardTasks исходный массив
        this.#filmCards = [...this.#sourcedBoardFilms];
    }

    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    // - Сортируем фильмы
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortCards(sortType);
    // - Очищаем список
    this.#clearFilmsSection();
    // - Рендерим список заново
    this.#renderFilmsSection();
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#filmsBlockComponent.element, RenderPosition.BEFOREBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderFilm = (card) => {
    const filmPresenter = new FilmPresenter(this.#filmsListContainerComponent.element, this.#handleFilmChange, this.#handleModeChange);
    filmPresenter.init(card);
    this.#filmPresentersList.set(card.id, filmPresenter);
  };

  #renderFilms = (from, to) => {
    this.#filmCards
      .slice(from, to)
      .forEach((card) => this.#renderFilm(card));
  };

  #renderNoCards = () => {
    const filmsTitle = this.#filmsListComponent.element.querySelector('.films-list__title');
    filmsTitle.classList.remove('visually-hidden');
    filmsTitle.textContent = 'There are no movies in our database';
  };

  #renderLoadMoreButton = () => {
    render(this.#loadMoreButtonComponent, this.#filmsListComponent.element);
    this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButtonClick);
  };

  #clearFilmsSection = () => {
    this.#filmPresentersList.forEach((presenter) => presenter.destroy());
    this.#filmPresentersList.clear();
    this.#renderedCardCount = CARD_COUNT_PER_STEP;
    remove(this.#loadMoreButtonComponent);
  };

  #renderFilmsSection = () => {
    render(this.#filmsBlockComponent, this.#filmsBlockContainer);
    render(this.#filmsListComponent, this.#filmsBlockComponent.element, RenderPosition.AFTERBEGIN);
    render(this.#filmsListContainerComponent, this.#filmsListComponent.element);

    this.#renderFilms(0, Math.min(this.#filmCards.length, CARD_COUNT_PER_STEP));

    if (this.#filmCards.length > CARD_COUNT_PER_STEP) {
      this.#renderLoadMoreButton();
    }
  };

  #renderFilmsBoard = () => {
    this.#renderFilmsSection();
    this.#renderSort();
  };
}