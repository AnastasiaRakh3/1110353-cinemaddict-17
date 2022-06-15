import {render} from './framework/render.js';
import FiltersPresenter from './presenter/filters-presenter.js';
import FooterStatisticsView from './view/footer-statistics.js';
import FilmsBoardPresenter from './presenter/films-board-presenter.js';
import FilmCardsModel from './model/film-cards-model.js';
import FiltersModel from './model/filters-model.js';
import UserModel from './model/user-model.js';
import UserPresenter from './presenter/user-presenter.js';
import CardsApiService from './api/cards-api-service.js';

const AUTHORIZATION = 'Basic hS2sfS445555552j';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict/';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerStatisticsContainerElement = document.querySelector('.footer__statistics');

const filmCardsModel = new FilmCardsModel(new CardsApiService(END_POINT, AUTHORIZATION));
const filtersModel = new FiltersModel();
const userModel = new UserModel();
const filmsPresenter = new FilmsBoardPresenter(siteMainElement, filmCardsModel, filtersModel);
const filtersPresenter = new FiltersPresenter(siteMainElement, filmCardsModel, filtersModel);
const userPresenter = new UserPresenter(siteHeaderElement, filmCardsModel, userModel);

userPresenter.init();
filtersPresenter.init();
render(new FooterStatisticsView(), footerStatisticsContainerElement);

filmsPresenter.init();
filmCardsModel.init();
