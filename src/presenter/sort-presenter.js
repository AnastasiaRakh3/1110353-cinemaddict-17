import SortView from '../view/sort-view.js';
import {SortType} from '../const.js';
import { render, replace, remove, RenderPosition } from '../framework/render.js';


export default class SortPresenter {

  #renderingPlace = null;

  #currentSortType = SortType.DEFAULT;
  #sortComponent = null;
  #changeData = null;

  constructor (renderingPlace, changeData) {
    this.#renderingPlace = renderingPlace;
    this.#changeData = changeData;
  }

  init = (currentSortType) => {
    this.#currentSortType = currentSortType;
    const prevSortComponent = this.#sortComponent;
    this.#sortComponent = new SortView(currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortClick);

    if(prevSortComponent === null) {
      render(this.#sortComponent, this.#renderingPlace, RenderPosition.BEFOREBEGIN);
      return;
    }

    replace(this.#sortComponent, prevSortComponent);
    remove(prevSortComponent);
  };

  #handleSortClick = (newSortType) => {
    this.#changeData(newSortType);
  };
}
