import NavigationView from './view/nav-view.js';
import SortingView from './view/sorting-view.js';
import UserView from './view/user-view.js';
import FooterStatisticsView from './view/footer-statistics.js';
import FilmsPresenter from './presenter/films-presenter.js';
import FilmCardsModel from './model/film-cards-model.js';
import {render, RenderPosition} from './framework/render.js';
import {generateFilter} from './mock/filter.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatisticsContainerElement = document.querySelector('.footer__statistics');

const filmCardsModel = new FilmCardsModel();
const filmsPresenter = new FilmsPresenter(siteMainElement, filmCardsModel);

const filters = generateFilter(filmCardsModel.filmCards);

render(new UserView(), siteHeaderElement);
render(new NavigationView(filters), siteMainElement, RenderPosition.AFTERBEGIN);
render(new SortingView(), siteMainElement);
render(new FooterStatisticsView(), footerStatisticsContainerElement);

filmsPresenter.init();


