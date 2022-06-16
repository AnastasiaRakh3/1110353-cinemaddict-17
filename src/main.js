import FiltersPresenter from './presenter/filters-presenter.js';
import FilmsBoardPresenter from './presenter/films-board-presenter.js';
import FilmCardsModel from './model/film-cards-model.js';
import FiltersModel from './model/filters-model.js';
import UserModel from './model/user-model.js';
import UserPresenter from './presenter/user-presenter.js';
import CardsApiService from './api/cards-api-service.js';
import FooterPresenter from './presenter/footer-presenter.js';
import { END_POINT, AUTHORIZATION } from './server-config.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

const filmCardsModel = new FilmCardsModel(new CardsApiService(END_POINT, AUTHORIZATION));
const filtersModel = new FiltersModel();
const userModel = new UserModel();
const filmsBoardPresenter = new FilmsBoardPresenter(siteMainElement, filmCardsModel, filtersModel);
const filtersPresenter = new FiltersPresenter(siteMainElement, filmCardsModel, filtersModel);
const userPresenter = new UserPresenter(siteHeaderElement, filmCardsModel, userModel);
const footerPresenter = new FooterPresenter(filmCardsModel);

userPresenter.init();
filtersPresenter.init();
footerPresenter.init();
filmsBoardPresenter.init();
//почему в демо в конце? ведь получаем карточки которые нужны для отрисовки
filmCardsModel.init();
// filmCardsModel.init()
//   .finally(() => { // Выполнит вне зависимости от того, завершился промис успешно или нет
//     // Отрендерить фильтры и сортировку?
//   });
