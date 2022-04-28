import NatigationView from './view/nav-view.js';
import FiltersView from './view/filters-view.js';
import UserView from './view/user-view.js';
import {render, RenderPosition} from './render.js';
import FilmsPresenter from './presenter/films-presenter.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const filmsPresenter = new FilmsPresenter();

render(new UserView(), siteHeaderElement);
render(new NatigationView(), siteMainElement, RenderPosition.AFTERBEGIN);
render(new FiltersView(), siteMainElement);

filmsPresenter.init(siteMainElement);

