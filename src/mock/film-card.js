import {getRandomInteger} from '../utils.js';
import {commentIdCounter} from './comment.js';

const AGE_RATING = [0, 8, 16, 21];
const DIRECTORS = ['Стивен Аллан Спилберг', 'Мартин Чарльз Скорсезе', 'Альфред Джозеф Хичкок', 'Стэнли Кубрик'];
const WRITERS = ['Оскар Уайльд', 'Эрнест Хемингуэй', 'Лев Толстой'];
const ACTORS = ['Джонни Депп', 'Брэд Питт', 'Киану Ривз'];
const RELEASE_COUNTRIES = ['Russia', 'Finland', 'France'];
const GENRES = ['Comedy', 'Drama', 'Horror'];
const DESCRIPTIONS = ['Лучший фильм всех времен', 'Печальная истории мальчика', 'Фантастический фильм о любви'];
const WATCHING_DATE = ['2022-03-11T12:10:32.554Z', '2019-04-12T16:12:32.554Z', '2021-01-09T21:23:32.554Z'];

let filmIdCounter = 1;
const generateFilmtId = () => filmIdCounter++;

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

const generateAlternativeFilmTitle = () => {
  const alternativeFilmTitles = [
    'Космическое путешествие',
    'Австралийская история любви',
    'Просто комедия',
    'Хрустальная туфелька'
  ];
  const randomIndex = getRandomInteger(0, alternativeFilmTitles.length - 1);
  return alternativeFilmTitles[randomIndex];
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

const countTime = (time) => {
  const hours = Math.trunc(time/60);
  const minutes = time%60;

  switch (true) {
    case Boolean(hours && minutes):
      return `${hours}h ${minutes}m`;
    case Boolean(hours):
      return `${hours}h`;
    case Boolean(minutes):
      return `${minutes}m`;
  }
};

const getId = () => getRandomInteger(1, commentIdCounter);

const getCommentsIdArray = () => {
  const array = Array.from({length: commentIdCounter}, getId);
  return array;
};

export const generateFilmCard = () => ({
  id: generateFilmtId,
  comments: getCommentsIdArray(),
  filmInfo: {
    title: generateFilmTitle(),
    alternativeTitle: generateAlternativeFilmTitle(),
    totalRating: (getRandomInteger(4, 9) + getRandomInteger(0, 10)/10).toFixed(1),
    poster: generatePoster(),
    ageRating: AGE_RATING[getRandomInteger(0, AGE_RATING.length -1)],
    director: DIRECTORS[getRandomInteger(0, DIRECTORS.length -1)],
    writers: [
      WRITERS[getRandomInteger(0, WRITERS.length -1)],
    ],
    actors: [
      ACTORS[getRandomInteger(0, ACTORS.length -1)]
    ],
    release: {
      date: generateFilmReleaseDate(),
      releaseCountry: RELEASE_COUNTRIES[getRandomInteger(0, RELEASE_COUNTRIES.length -1)]
    },
    runtime: countTime(getRandomInteger(45, 140)),
    genre: [
      GENRES[getRandomInteger(0, GENRES.length -1)]
    ],
    description: DESCRIPTIONS[getRandomInteger(0, DESCRIPTIONS.length -1)]
  },
  userDetails: {
    watchlist: Boolean(getRandomInteger(0,1)),
    alreadyWatched: Boolean(getRandomInteger(0,1)),
    watchingDate: WATCHING_DATE[getRandomInteger(0, WATCHING_DATE.length -1)],
    favorite: Boolean(getRandomInteger(0,1))
  }
});
