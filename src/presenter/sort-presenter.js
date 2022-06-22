import SortView from '../view/sort-view.js';
import { SortType } from '../const.js';
import { render, replace, remove, RenderPosition } from '../framework/render.js';


export default class SortPresenter {
  #renderingPlace = null;
  #changeData = null;

  #currentSortType = SortType.DEFAULT;
  #sortComponent = null;

  constructor(renderingPlace, changeData) {
    this.#renderingPlace = renderingPlace;
    this.#changeData = changeData;
  }

  init = (currentSortType) => {
    const prevSortComponent = this.#sortComponent;
    this.#currentSortType = currentSortType;
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortClick);

    if (prevSortComponent === null) {
      render(this.#sortComponent, this.#renderingPlace, RenderPosition.BEFOREBEGIN);
      return;
    }

    replace(this.#sortComponent, prevSortComponent);
    remove(prevSortComponent);
  };

  destroy = () => {
    remove(this.#sortComponent);
    this.#sortComponent = null;
  };

  #handleSortClick = (newSortType) => {
    this.#changeData(newSortType);
  };
}
