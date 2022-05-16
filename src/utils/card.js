import dayjs from 'dayjs';

const humanizeFilmDate = (dueDate) => dayjs(dueDate).format('YYYY');
const humanizePopupFilmDate = (dueDate) => dayjs(dueDate).format('DD MMMM YYYY');
const humanizeCommentDate = (dueDate) => dayjs(dueDate).format('YYYY/MM/DD HH:mm');

export {humanizeFilmDate, humanizePopupFilmDate, humanizeCommentDate};
