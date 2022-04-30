import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const humanizeFilmDate = (dueDate) => dayjs(dueDate).format('YYYY');
const humanizeCommentDate = (dueDate) => dayjs(dueDate).format('YYYY/MM/DD HH:mm');

export {getRandomInteger, humanizeFilmDate, humanizeCommentDate};
