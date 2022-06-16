import FooterStatisticsView from '../view/footer-statistics';
import {render, replace, remove} from '../framework/render';

export default class FooterPresenter {
  #cardsModel = null;
  #footerComponent = null;

  constructor(cardsModel) {
    this.#cardsModel = cardsModel;
    this.#cardsModel.addObserver(this.#handleMoviesDatabaseChange);
  }

  get cards () {
    return this.#cardsModel.filmCards;
  }

  init = () => {
    const prevFooterComponent = this.#footerComponent;
    this.#footerComponent = new FooterStatisticsView(this.cards.length);

    const footerStatisticsContainerElement = document.querySelector('.footer__statistics');

    if (prevFooterComponent === null) {
      render(this.#footerComponent, footerStatisticsContainerElement);
      return;
    }

    replace(this.#footerComponent, prevFooterComponent);
    remove(prevFooterComponent);
  };

  #handleMoviesDatabaseChange = () => {
    this.init();
  };
}
