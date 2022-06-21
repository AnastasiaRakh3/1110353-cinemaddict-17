import FilmsBlockView from '../../view/films-section/films-block-view';
import FilmsListView from '../../view/films-section/films-list-view.js';
import FilmsListContainerView from '../../view/films-section/films-list-container-view.js';
import LoadMoreButtonView from '../../view/films-section/loadmore-button-view.js';
import NoFilmsListTitleView from '../../view/films-section/no-films-list-title-view.js';
import FilmsListTitleView from '../../view/films-section/films-list-title-view.js';
import LoadingView from '../../view/loading-view.js';
import FilmPresenter from './film-presenter.js';
import SortPresenter from '../sort-presenter.js';
import { SortType, UpdateType, FilterType, UserAction } from '../../const.js';
import { sortCardsByDate, sortCardsByRating } from '../../utils/sort.js';
import { filter } from '../../utils/filter.js';
import { render, RenderPosition, remove } from '../../framework/render.js';
import { uiBlockerInstance } from '../../utils/ui-blocker';

const CARD_COUNT_PER_STEP = 5;

export default class FilmsBoardPresenter {
  #filmsBlockContainer = null;
  #cardsModel = null;
  #filtersModel = null;

  #renderedCardCount = CARD_COUNT_PER_STEP;
  #isLoading = true;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;

  #noFilmsListTitleComponent = null;
  #sortPresenter = null;
  #filmsBlockComponent = new FilmsBlockView();
  #filmsListComponent = new FilmsListView();
  #filmsListTitleComponent = new FilmsListTitleView();
  #filmsListContainerComponent = new FilmsListContainerView();
  #loadMoreButtonComponent = new LoadMoreButtonView();
  #loadingComponent = new LoadingView();
  #filmPresentersList = new Map();
  #uiBlocker = uiBlockerInstance;

  constructor(filmsBlockContainer, cardsModel, filtersModel) {
    this.#filmsBlockContainer = filmsBlockContainer;
    this.#cardsModel = cardsModel;
    this.#filtersModel = filtersModel;

    this.#cardsModel.addObserver(this.#handleModelChange);
    this.#filtersModel.addObserver(this.#handleModelChange);
  }

  get filmCards() {
    this.#filterType = this.#filtersModel.filter;
    const cards = this.#cardsModel.filmCards;
    const filteredCards = filter[this.#filterType](cards);

    switch (this.#currentSortType) {
      case SortType.DATE_UP:
        return filteredCards.sort(sortCardsByDate);
      case SortType.RATING:
        return filteredCards.sort(sortCardsByRating);
    }

    return filteredCards;
  }

  init = () => {
    this.#renderFilmsBoard();
  };

  #handleLoadMoreButtonClick = () => {
    const cardCount = this.filmCards.length;
    const newRenderedCardCount = Math.min(cardCount, this.#renderedCardCount + CARD_COUNT_PER_STEP);
    const moreCardsToRender = this.filmCards.slice(this.#renderedCardCount, newRenderedCardCount);
    this.#renderFilms(moreCardsToRender);
    this.#renderedCardCount = newRenderedCardCount;

    if (this.#renderedCardCount === cardCount) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  #handleModeChange = () => {
    this.#filmPresentersList.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (userAction, updateType, update) => {
    switch (userAction) {
      case UserAction.ADD_COMMENT:
        this.#cardsModel.updateCommentsInCard(updateType, update);
        break;
      default:
        this.#uiBlocker.block();
        try {
          await this.#cardsModel.updateCard(updateType, update);
        } catch {
          this.#filmPresentersList.get(update.id).shakeFilm();
        }
        this.#uiBlocker.unblock();
    }
  };

  #handleModelChange = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresentersList.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#filmPresentersList.get(data.id).init(data);
        if (this.#filterType !== FilterType.ALL) {
          this.#clearFilmsSection();
          this.#renderFilmsSection();
        }
        break;
      case UpdateType.MAJOR:
        this.#clearFilmsSection({ resetRenderedCardCount: true, resetSortType: true });
        this.#renderFilmsSection();
        this.#sortPresenter.init();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderFilmsSection();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#sortPresenter.init(this.#currentSortType);
    this.#clearFilmsSection();
    this.#renderFilmsSection();
  };

  #renderFilm = (card) => {
    const filmPresenter = new FilmPresenter(this.#filmsListContainerComponent.element, this.#handleViewAction, this.#handleModeChange, card);
    filmPresenter.init(card);
    this.#filmPresentersList.set(card.id, filmPresenter);
  };

  #renderFilms = (cards) => {
    cards.forEach((card) => this.#renderFilm(card));
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#filmsListComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderNoCards = () => {
    this.#noFilmsListTitleComponent = new NoFilmsListTitleView(this.#filterType);
    remove(this.#filmsListTitleComponent);
    render(this.#noFilmsListTitleComponent, this.#filmsListComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderLoadMoreButton = () => {
    render(this.#loadMoreButtonComponent, this.#filmsListComponent.element);
    this.#loadMoreButtonComponent.setClickHandler(this.#handleLoadMoreButtonClick);
  };

  #renderFilmsSection = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const cardCount = this.filmCards.length;
    const cardsToRender = this.filmCards.slice(0, this.#renderedCardCount);
    this.#renderFilms(cardsToRender);

    if (cardsToRender.length < cardCount) {
      this.#renderLoadMoreButton();
    }

    if (cardCount === 0) {
      this.#renderNoCards();
      return;
    }

    render(this.#filmsListTitleComponent, this.#filmsListComponent.element, RenderPosition.AFTERBEGIN);
  };

  #clearFilmsSection = ({ resetRenderedCardCount = false, resetSortType = false } = {}) => {
    this.#filmPresentersList.forEach((presenter) => presenter.destroy());
    this.#filmPresentersList.clear();

    remove(this.#loadMoreButtonComponent);
    remove(this.#loadingComponent);

    if (resetRenderedCardCount) {
      this.#renderedCardCount = CARD_COUNT_PER_STEP;
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }

    if (this.#noFilmsListTitleComponent) {
      remove(this.#noFilmsListTitleComponent);
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
