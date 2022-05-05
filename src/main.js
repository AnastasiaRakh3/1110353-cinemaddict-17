import NavigationView from './view/nav-view.js';
import FiltersView from './view/filters-view.js';
import UserView from './view/user-view.js';
import FooterStatisticsView from './view/footer-statistics.js';
import {render, RenderPosition} from './render.js';
import FilmsPresenter from './presenter/films-presenter.js';
import FilmCardsModel from './model/film-cards-model.js';
import CommentsPresenter from './presenter/comments-presenter.js';
import CommentsModel from './model/comments-model.js';
import PopupPresenter from './presenter/popup-presenter.js';
import PopupModel from './model/popup-model.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatisticsContainerElement = document.querySelector('.footer__statistics');

const filmsPresenter = new FilmsPresenter();
const filmCardsModel = new FilmCardsModel();
const commentsPresenter = new CommentsPresenter();
const commentsModel = new CommentsModel();
const popupModel = new PopupModel();
const popupPresenter = new PopupPresenter();

render(new UserView(), siteHeaderElement);
render(new NavigationView(), siteMainElement, RenderPosition.AFTERBEGIN);
render(new FiltersView(), siteMainElement);
render(new FooterStatisticsView(), footerStatisticsContainerElement);

filmsPresenter.init(siteMainElement, filmCardsModel);

popupPresenter.init(siteMainElement, popupModel);
const commentsList = document.querySelector('.film-details__comments-list');
commentsPresenter.init(commentsList, commentsModel);

