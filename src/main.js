import NatigationView from './view/nav-view.js';
import FiltersView from './view/filters-view.js';
import UserView from './view/user-view.js';
import {render, RenderPosition} from './render.js';
import FilmsPresenter from './presenter/films-presenter.js';
import FooterStatisticsView from './view/footer-statistics.js';
import FilmCardsModel from './model/film-cards-model.js';
import Popup from './view/popup-view.js';
import CommentsPresenter from './presenter/popup-presenter.js';
import CommentsModel from './model/comments-model.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatisticsContainerElement = document.querySelector('.footer__statistics');

const filmsPresenter = new FilmsPresenter();
const filmCardsModel = new FilmCardsModel();
const commentsPresenter = new CommentsPresenter();
const commentsModel = new CommentsModel();

render(new UserView(), siteHeaderElement);
render(new NatigationView(), siteMainElement, RenderPosition.AFTERBEGIN);
render(new FiltersView(), siteMainElement);
render(new FooterStatisticsView(), footerStatisticsContainerElement);

filmsPresenter.init(siteMainElement, filmCardsModel);

render(new Popup(), siteMainElement);
const commentsList = document.querySelector('.film-details__comments-list');
commentsPresenter.init(commentsList, commentsModel);

