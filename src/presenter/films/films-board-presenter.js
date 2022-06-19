import FilmsBlockView from '../../view/films-section/films-block-view';
import FilmsListView from '../../view/films-section/films-list-view.js';
import FilmsListContainerView from '../../view/films-section/films-list-container-view.js';
import LoadMoreButtonView from '../../view/films-section/loadmore-button-view.js';
import NoFilmsListTitleView from '../../view/films-section/no-films-list-title-view.js';
import FilmsListTitleView from '../../view/films-section/films-list-title-view.js';
import LoadingView from '../../view/loading-view.js';
import FilmPresenter from './film-presenter.js';
import SortPresenter from '../sort-presenter.js';
import { SortType, UpdateType, FilterType, TimeLimit } from '../../const.js';
import { sortCardsByDate, sortCardsByRating } from '../../utils/sort.js';
import { filter } from '../../utils/filter.js';
import { render, RenderPosition, remove } from '../../framework/render.js';
import UiBlocker from '../../framework/ui-blocker/ui-blocker.js';

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
  #filmsExtraPresenterList = new Map();
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(filmsBlockContainer, cardsModel, filtersModel) {
    this.#filmsBlockContainer = filmsBlockContainer;
    this.#cardsModel = cardsModel;
    this.#filtersModel = filtersModel;

    this.#cardsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  // Геттер, возвращающий массив карточек в нужном порядке, в зависимости какая сортировка включена
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

  // Метод, который мы вызываем при нажатии кнопки Загрузить еще
  #handleLoadMoreButtonClick = () => {
    // Считаем ко-во всех карточек в отсортированном массиве, который взяли из геттера
    const cardCount = this.filmCards.length;
    // Считаем ко-во карточек, которые отрисуются при нажатии кнопки
    // С Math.min проверяем нужно ли нам рисовать еще +5 карточек, тк newRenderedCardCount не может быть больше длины всех карточек. Например: всего 12 карточек, отрисовано 10, при нажатии кнопки будет не 15, а 12
    const newRenderedCardCount = Math.min(cardCount, this.#renderedCardCount + CARD_COUNT_PER_STEP);
    // Считаем ко-во новых карточек, которые нужно еще отрисовать
    const moreCardsToRender = this.filmCards.slice(this.#renderedCardCount, newRenderedCardCount);
    this.#renderFilms(moreCardsToRender);
    this.#renderedCardCount = newRenderedCardCount;

    // Если длина отрисованных карточек больше или равна ко-ву всех карточек в массиве, убираем кнопку
    if (this.#renderedCardCount === cardCount) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  // Метод перебирает все карточки и закрывает открытый попап
  #handleModeChange = () => {
    this.#filmPresentersList.forEach((presenter) => presenter.resetView());
  };

  // Метод, вызывающий обновление модели
  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    console.log(actionType, updateType, update);
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    try {
      await this.#cardsModel.updateCard(updateType, update);
    } catch {
      this.#filmPresentersList.get(update.id).shakeFilm();
    }

    this.#uiBlocker.unblock();
  };

  // Метод, который добавим в наблюдатель
  #handleModelEvent = (updateType, data) => {
    console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить карточку (например, когда добавили класс Favorites)
        // В списке презенторов находим нужный перезентер карточки по ключю айди карточки и запускаем его, он отрисует карточку
        this.#filmPresentersList.get(data.id).init(data);
        if (this.#filterType !== FilterType.ALL) {
          this.#clearFilmsSection();
          this.#renderFilmsSection();
        }
        break;
      case UpdateType.MINOR:
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

  // Метод, который говорит, что делать при сортировке
  #handleSortTypeChange = (sortType) => {
    // Если нажата уже влюченная сортировка, сразу выходим, ничего не делая
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    // Отрисовываем сортировку с нужным типом, там же навешивается лисенер на все случаи
    this.#sortPresenter.init(this.#currentSortType);
    // Удаляем и заново перерисовываем карточки в нужной сортировке и кнопку
    this.#clearFilmsSection();
    this.#renderFilmsSection();
  };

  #renderFilm = (card) => {
    const filmPresenter = new FilmPresenter(this.#filmsListContainerComponent.element, this.#handleViewAction, this.#handleModeChange);
    filmPresenter.init(card);
    // Добавляет свойство с ключом айди карточки и значение экземпляр класс(презентер карточки)
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

  // Рендерит нужные фильмы и кнопку Загрузить еще
  #renderFilmsSection = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const cardCount = this.filmCards.length;
    const cardsToRender = this.filmCards.slice(0, this.#renderedCardCount);

    this.#renderFilms(cardsToRender);

    // Если длина отрисованных карточек меньше чем всех карточек, рисуем кнопку
    if (cardsToRender.length < cardCount) {
      this.#renderLoadMoreButton();
    }

    if (cardCount === 0) {
      this.#renderNoCards();
      return;
    }

    render(this.#filmsListTitleComponent, this.#filmsListComponent.element, RenderPosition.AFTERBEGIN);
  };

  // То же самое, что и {нет ключа, нет ключа}, но нужна такая запись, чтобы учесть, что эти ключи могут быть
  #clearFilmsSection = ({ resetRenderedCardCount = false, resetSortType = false } = {}) => {
    // Обходит карту(кол-цию) с презентерами карточек и удаляет карточку и попап с методом destroy, который мы создали в film-presenter, но элементы еще есть, просто пустые
    this.#filmPresentersList.forEach((presenter) => presenter.destroy());
    // Очищает мапу, удаляет все элементы, она становится пустая
    this.#filmPresentersList.clear();

    remove(this.#loadMoreButtonComponent);
    remove(this.#loadingComponent);

    // Если нужно сбросить ко-во карточек и опять 5
    if (resetRenderedCardCount) {
      this.#renderedCardCount = CARD_COUNT_PER_STEP;
    }

    // Если нужно сортировку сделать дефолтную, например когда буде нажимать кнопки watchlist, favoutites и тд
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
    // Создаем презентер вьюхи сортировки, куда отрендерить и что делать при клике
    this.#sortPresenter = new SortPresenter(this.#filmsBlockComponent.element, this.#handleSortTypeChange);
    this.#sortPresenter.init(this.#currentSortType);
  };
}
