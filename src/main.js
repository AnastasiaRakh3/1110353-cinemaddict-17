import NavigationView from './view/nav-view.js';
import FiltersView from './view/filters-view.js';
import UserView from './view/user-view.js';
import FooterStatisticsView from './view/footer-statistics.js';
import {render, RenderPosition} from './render.js';
import {FilmsPresenter, siteMainElement} from './presenter/films-presenter.js';
import FilmCardsModel from './model/film-cards-model.js';

const siteHeaderElement = document.querySelector('.header');
const footerStatisticsContainerElement = document.querySelector('.footer__statistics');

const filmsPresenter = new FilmsPresenter();
const filmCardsModel = new FilmCardsModel();

render(new UserView(), siteHeaderElement);
render(new NavigationView(), siteMainElement, RenderPosition.AFTERBEGIN);
render(new FiltersView(), siteMainElement);
render(new FooterStatisticsView(), footerStatisticsContainerElement);

filmsPresenter.init(siteMainElement, filmCardsModel);


