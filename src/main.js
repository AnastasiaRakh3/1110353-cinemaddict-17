import {render, RenderPosition} from './framework/render.js';
import NavigationView from './view/nav-view.js';
import UserView from './view/user-view.js';
import FooterStatisticsView from './view/footer-statistics.js';
import FilmsBoardPresenter from './presenter/films-board-presenter.js';
import FilmCardsModel from './model/film-cards-model.js';
import {generateFilter} from './mock/filter.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatisticsContainerElement = document.querySelector('.footer__statistics');

const filmCardsModel = new FilmCardsModel();
const filmsPresenter = new FilmsBoardPresenter(siteMainElement, filmCardsModel);

const filters = generateFilter(filmCardsModel.filmCards);

render(new UserView(), siteHeaderElement);
render(new NavigationView(filters), siteMainElement, RenderPosition.AFTERBEGIN);
render(new FooterStatisticsView(), footerStatisticsContainerElement);

filmsPresenter.init();


