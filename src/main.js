import FiltersPresenter from './presenter/filters-presenter.js';
import FilmsBoardPresenter from './presenter/films/films-board-presenter.js';
import UserPresenter from './presenter/user-presenter.js';
import FooterPresenter from './presenter/footer-presenter.js';
import FilmCardsModel from './model/film-cards-model.js';
import FiltersModel from './model/filters-model.js';
import CardsApiService from './api/cards-api-service.js';
import { END_POINT, AUTHORIZATION } from './server-config.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

const filmCardsModel = new FilmCardsModel(new CardsApiService(END_POINT, AUTHORIZATION));
const filtersModel = new FiltersModel();
const filmsBoardPresenter = new FilmsBoardPresenter(siteMainElement, filmCardsModel, filtersModel);
const filtersPresenter = new FiltersPresenter(siteMainElement, filmCardsModel, filtersModel);
const userPresenter = new UserPresenter(siteHeaderElement, filmCardsModel);
const footerPresenter = new FooterPresenter(filmCardsModel);

userPresenter.init();
filtersPresenter.init();
footerPresenter.init();
filmsBoardPresenter.init();
filmCardsModel.init();
