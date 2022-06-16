import AbstractView from '../framework/view/abstract-view.js';

const createFooterStatisticsTemplate = (cards) => {
  const MOVIES_DATABASE_COUNT = '130 291';
  const checkMoviesCount = () => {
    if (cards.length) {
      return MOVIES_DATABASE_COUNT;
    }
    return cards.length;
  };
  return `<p>${checkMoviesCount()} movies inside</p>`;

};

export default class FooterStatisticsView extends AbstractView {
  #cardsModel = null;

  constructor(cardsModel) {
    super();
    this.#cardsModel = cardsModel;
    console.log(this.#cardsModel);
  }

  get template() {
    return createFooterStatisticsTemplate(this.#cardsModel);
  }
}
