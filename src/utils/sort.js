import dayjs from 'dayjs';

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

const sortCardsByDate = (cardA, cardB) => {
  const weight = getWeightForNullDate(cardA.filmInfo.release.date, cardB.filmInfo.release.date);
  return weight ?? dayjs(cardB.filmInfo.release.date).diff(dayjs(cardA.filmInfo.release.date));
};

const sortCardsByRating = (cardA, cardB) => cardB.filmInfo.totalRating - cardA.filmInfo.totalRating;

export { sortCardsByDate, sortCardsByRating };


