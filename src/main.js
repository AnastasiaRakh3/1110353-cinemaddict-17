import NatigationView from './view/nav-view.js';
import FiltersView from './view/filters-view.js';
import UserView from './view/user-view.js';
import {render} from './render.js';
import FilmsPresenter from './presenter/films-presenter.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const filmsPresenter = new FilmsPresenter();

render(new UserView(), siteHeaderElement, 'beforeend');
render(new NatigationView(), siteMainElement, 'afterbegin');
render(new FiltersView(), siteMainElement, 'beforeend');

filmsPresenter.init(siteMainElement);

