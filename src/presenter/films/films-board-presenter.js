import FilmsBlockView from '../../view/films-section/films-block-view.js';
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
import { uiBlockerInstance } from '../../utils/ui-blocker.js';

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
  #openedFilmPresenter = null;
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
    render(this.#filmsBlockComponent, this.#filmsBlockContainer);
    render(this.#filmsListComponent, this.#filmsBlockComponent.element, RenderPosition.AFTERBEGIN);
    render(this.#filmsListContainerComponent, this.#filmsListComponent.element);
    this.#sortPresenter = new SortPresenter(this.#filmsBlockComponent.element, this.#handleSortTypeChange);

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

  #handleModeChange = (openedFilmId) => {
    if (this.#openedFilmPresenter?.cardId !== openedFilmId && this.#openedFilmPresenter) {
      this.#openedFilmPresenter.resetView();
    }

    this.#openedFilmPresenter = this.#filmPresentersList.get(openedFilmId);
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
          const currentFilmPresenter = update.id === this.#openedFilmPresenter?.cardId
            ? this.#openedFilmPresenter
            : this.#filmPresentersList.get(update.id);
          currentFilmPresenter.disableControls();
          await this.#cardsModel.updateCard(updateType, update);
          currentFilmPresenter.enableControls();
        } catch {
          this.#filmPresentersList.get(update.id).shakeFilm();
        }
        this.#uiBlocker.unblock();
    }
  };

  #handleModelChange = (updateType, update) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresentersList.get(update.id).init(update);
        break;
      case UpdateType.MINOR: {
        const currentFilmPresenter = update.id === this.#openedFilmPresenter?.cardId
          ? this.#openedFilmPresenter
          : this.#filmPresentersList.get(update.id);
        currentFilmPresenter.init(update);
        if (this.#filterType !== FilterType.ALL) {
          this.#clearFilmsSection();
          this.#renderFilmsBoard();
        }
        break;
      }
      case UpdateType.MAJOR:
        this.#clearFilmsSection({ resetRenderedCardCount: true, resetSortType: true });
        this.#renderFilmsBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderFilmsBoard();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearFilmsSection();
    this.#renderFilmsBoard();
  };

  #renderSort = () => {
    if (this.filmCards.length) {
      this.#sortPresenter.init(this.#currentSortType);
    } else {
      this.#sortPresenter.destroy();
    }
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
    const cardCount = this.filmCards.length;
    const cardsToRender = this.filmCards.slice(0, this.#renderedCardCount);

    if (cardCount === 0) {
      this.#renderNoCards();
      return;
    }

    if (cardsToRender.length < cardCount) {
      this.#renderLoadMoreButton();
    }

    this.#renderFilms(cardsToRender);
    render(this.#filmsListTitleComponent, this.#filmsListComponent.element, RenderPosition.AFTERBEGIN);
  };

  #clearFilmsSection = ({ resetRenderedCardCount = false, resetSortType = false } = {}) => {
    this.#filmPresentersList.forEach((presenter) => {
      if (presenter === this.#openedFilmPresenter) {
        presenter.removeCard();
        return;
      }
      presenter.destroy();
    });

    this.#filmPresentersList.clear();

    remove(this.#loadMoreButtonComponent);

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
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    this.#renderSort();
    this.#renderFilmsSection();
  };
}
