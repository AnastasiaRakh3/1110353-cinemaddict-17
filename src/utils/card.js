import dayjs from 'dayjs';
// для поддержки работы с продолжительностью
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const showFilmRunTime = (time) => dayjs.duration(time, 'minutes').format('H[h] mm[m]');
const humanizeFilmDate = (dueDate) => dayjs(dueDate).format('YYYY');
const humanizePopupFilmDate = (dueDate) => dayjs(dueDate).format('DD MMMM YYYY');
const humanizeCommentDate = (dueDate) => dayjs(dueDate).format('YYYY/MM/DD HH:mm');

// Функция помещает карты без даты в конце списка,
// возвращая нужный вес для колбэка sort
const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

const sortCardUp = (cardA, cardB) => {
  const weight = getWeightForNullDate(cardA.filmInfo.release.date, cardB.filmInfo.release.date);
  return weight ?? dayjs(cardA.filmInfo.release.date).diff(dayjs(cardB.filmInfo.release.date));
};

const sortCardRating = (cardA, cardB) => cardA.filmInfo.totalRating - cardB.filmInfo.totalRating;

export {humanizeFilmDate, humanizePopupFilmDate, humanizeCommentDate, sortCardUp, sortCardRating, showFilmRunTime};
