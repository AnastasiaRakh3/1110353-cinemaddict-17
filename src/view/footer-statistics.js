import AbstractView from '../framework/view/abstract-view.js';

const createFooterStatisticsTemplate = (cardsCount) => `<p>${cardsCount} movies inside</p>`;

export default class FooterStatisticsView extends AbstractView {
  #cardsCount = null;

  constructor(cardsCount) {
    super();
    this.#cardsCount = cardsCount;
  }

  get template() {
    return createFooterStatisticsTemplate(this.#cardsCount);
  }
}
