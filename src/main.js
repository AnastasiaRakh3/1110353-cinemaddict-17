import {render} from './framework/render.js';
import FiltersPresenter from './presenter/filters-presenter.js';
import UserView from './view/user-view.js';
import FooterStatisticsView from './view/footer-statistics.js';
import FilmsBoardPresenter from './presenter/films-board-presenter.js';
import FilmCardsModel from './model/film-cards-model.js';
import FiltersModel from './model/filters-model.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatisticsContainerElement = document.querySelector('.footer__statistics');

const filmCardsModel = new FilmCardsModel();
const filtersModel = new FiltersModel();
const filmsPresenter = new FilmsBoardPresenter(siteMainElement, filmCardsModel, filtersModel);
const filtersPresenter = new FiltersPresenter(siteMainElement, filmCardsModel, filtersModel);

render(new UserView(), siteHeaderElement);
filtersPresenter.init();
render(new FooterStatisticsView(), footerStatisticsContainerElement);

filmsPresenter.init();


