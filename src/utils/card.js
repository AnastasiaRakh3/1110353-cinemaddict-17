import dayjs from 'dayjs';
// для поддержки работы с продолжительностью
import duration from 'dayjs/plugin/duration';
// для форматирования строкового представления даты в формате относительного времени (например, 3 часа назад)
import relativeTime from 'dayjs/esm/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const showFilmRunTime = (time) => dayjs.duration(time, 'minutes').format('H[h] mm[m]');
const humanizeFilmDate = (dueDate) => dayjs(dueDate).format('YYYY');
const humanizePopupFilmDate = (dueDate) => dayjs(dueDate).format('DD MMMM YYYY');
const getTodayDate = () => dayjs().toISOString();
const showDateInTimeString = (date) => {
  const timeSpan =  dayjs(date).diff(dayjs());
  const negativeTimeSpan = -Math.abs(timeSpan);
  return dayjs.duration(negativeTimeSpan, 'millisecond').humanize(true);
};
const checkFilmRunTime = (time) => {
  if (time.includes('0h')) {
    return time.substr(3);
  }
  return time;

};

const checkTotalRating = (rating) => rating.toFixed(1);
const checkDescriptionLength = (string) => `${string.slice(1, 139)}...`;

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
const sortCardMostCommented = (cardA, cardB) => cardA.comments.length - cardB.comments.length;

export { humanizeFilmDate, humanizePopupFilmDate, getTodayDate, checkFilmRunTime, checkTotalRating, checkDescriptionLength, sortCardUp, sortCardRating, showFilmRunTime, sortCardMostCommented, showDateInTimeString };
