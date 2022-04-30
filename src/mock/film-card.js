import {getRandomInteger} from '../utils.js';

const generateFilmTitle = () => {
  const filmTitles = [
    'Убить Билла',
    'Поющие в терновнике',
    'Мистер Бин',
    'Золушка'
  ];
  const randomIndex = getRandomInteger(0, filmTitles.length - 1);
  return filmTitles[randomIndex];
};

const generatePoster = () => {
  const posters = [
    'images/posters/the-dance-of-life.jpg',
    'images/posters/made-for-each-other.png',
    'images/posters/sagebrush-trail.jpg',
  ];
  const randomIndex = getRandomInteger(0, posters.length - 1);
  return posters[randomIndex];
};

const generateFilmReleaseDate = () => {
  const filmDates = [
    '2019-05-11T00:00:00.000Z',
    '2021-03-10T00:00:00.000Z',
    '2005-01-25T00:00:00.000Z',
  ];
  const randomIndex = getRandomInteger(0, filmDates.length - 1);
  return filmDates[randomIndex];
};

export const generateFilmCard = () => ({
  title: generateFilmTitle(),
  poster: generatePoster(),
  releaseDate: generateFilmReleaseDate(),
  watchList: true,
// description:,
// totalRating:,
// genre:,
// writers:,
// runtime:,
// comments:,
// watchingDate:,
});
