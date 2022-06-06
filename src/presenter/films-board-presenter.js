import { render, RenderPosition, remove } from '../framework/render.js';
import FilmsBlockView from '../view/films-block-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsListContainerView from '../view/films-list-container-view.js';
import LoadMoreButtonView from '../view/loadmore-button-view.js';
import FilmPresenter from './film-presenter.js';
import {sortCardUp, sortCardRating} from '../utils/card.js';
import {SortType} from '../const.js';
import SortPresenter from './sort-presenter.js';

const CARD_COUNT_PER_STEP = 5;

export default class FilmsBoardPresenter {
  #filmsBlockContainer = null;
  #filmCardsModel = null;

  #currentSortType = SortType.DEFAULT;
  #filmsBlockComponent = new FilmsBlockView();
  #filmsListComponent = new FilmsListView();
  #filmsListContainerComponent = new FilmsListContainerView();
  #loadMoreButtonComponent = new LoadMoreButtonView();
  #renderedCardCount = CARD_COUNT_PER_STEP;
  #filmPresentersList = new Map();
  #sortPresenter = null;

  constructor(filmsBlockContainer, filmCardsModel) {
    this.#filmsBlockContainer = filmsBlockContainer;
    this.#filmCardsModel = filmCardsModel;
  }

  get filmsCards() {
    switch (this.#currentSortType) {
      case SortType.DATE_UP:
        return [...this.#filmCardsModel.filmCards].sort(sortCardUp);
      case SortType.RATING:
        return [...this.#filmCardsModel.filmCards].sort(sortCardRating);
    }
    return this.#filmCardsModel.filmCards;
  }

  init = () => {
    this.#renderFilmsBoard();

    // if (this.#filmCards.length === 0) {
    //   this.#renderNoCards();
    // }
  };

  #handleLoadMoreButtonClick = () => {
    const cardCount = this.filmsCards.length;
    const newRenderedCardCount = Math.min(cardCount, this.#renderedCardCount + CARD_COUNT_PER_STEP);
    const filmCards = this.filmsCards.slice(this.#renderedCardCount, newRenderedCardCount);
    this.#renderFilms(filmCards);
    this.#renderedCardCount = newRenderedCardCount;

    if (this.#renderedCardCount >= cardCount) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  #handleModeChange = () => {
    this.#filmPresentersList.forEach((presenter) => presenter.resetView());
  };

  #handleFilmChange = (updatedCard) => {
    // Здесь будем вызывать обновление модели
    this.#filmPresentersList.get(updatedCard.id).init(updatedCard);
  };

  // - Сортируем фильмы
  #handleSortTypeChange = (sortType) => {
    // Если нажата уже влюченная сортировка, сразу выходим, ничего не делая
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    // Отрисовываем сортировку, где навешен лисенер на все случаи
    this.#sortPresenter.init(this.#currentSortType);

    this.#clearFilmsSection();
    this.#renderFilmsSection(this.#renderedCardCount);
  };

  #renderFilm = (card) => {
    const filmPresenter = new FilmPresenter(this.#filmsListContainerComponent.element, this.#handleFilmChange, this.#handleModeChange);
    filmPresenter.init(card);
    this.#filmPresentersList.set(card.id, filmPresenter);
  };

  #renderFilms = (cards) => {
    cards.forEach((card) => this.#renderFilm(card));
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
    // Обходит карту(кол-цию) с презентерами вьюх и удаляет карточку и попап с методом destroy, который мы создали в film-presenter, но элементы еще есть, просто пустые
    this.#filmPresentersList.forEach((presenter) => presenter.destroy());
    // Очищает мапу, удаляет все элементы, она становится пустая
    this.#filmPresentersList.clear();
    // Ко-во нужных отрисованных карточек становится снова 5 (Зачем нужно было?)
    // this.#renderedCardCount = CARD_COUNT_PER_STEP;
    // Удаляет кнопку 'Загрузить еще' (Зачем? у нас же она удаляется в handleLoadMoreButtonClick)
    remove(this.#loadMoreButtonComponent);
  };

  #renderFilmsSection = (neededCards = CARD_COUNT_PER_STEP) => {
    const cardCount = this.filmCards.length;
    const cards = this.filmCards.slice(0, Math.min(cardCount, neededCards));

    this.#renderFilms(cards);

    if (cardCount > neededCards) {
      this.#renderLoadMoreButton();
    }
  };

  #renderFilmsBoard = () => {
    render(this.#filmsBlockComponent, this.#filmsBlockContainer);
    render(this.#filmsListComponent, this.#filmsBlockComponent.element, RenderPosition.AFTERBEGIN);
    render(this.#filmsListContainerComponent, this.#filmsListComponent.element);

    this.#renderFilmsSection();
    this.#sortPresenter = new SortPresenter(this.#filmsBlockComponent.element, this.#handleSortTypeChange);
    this.#sortPresenter.init(this.#currentSortType);
  };
}
