import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/esm/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const getTodayDate = () => dayjs().toISOString();

const humanizeFilmRunTime = (time) => {
  const filmRunTime = dayjs.duration(time, 'minutes').format('H[h] mm[m]');

  if (filmRunTime.includes('0h')) {
    return filmRunTime.substr(3);
  }

  return filmRunTime;
};

const humanizeCardFilmDate = (dueDate) => dayjs(dueDate).format('YYYY');

const humanizePopupFilmDate = (dueDate) => dayjs(dueDate).format('DD MMMM YYYY');

const displayRelativeTimeDate = (date) => {
  const timeSpan = dayjs(date).diff(dayjs());
  const negativeTimeSpan = -Math.abs(timeSpan);
  return dayjs.duration(negativeTimeSpan, 'millisecond').humanize(true);
};

export { getTodayDate, humanizeCardFilmDate, humanizePopupFilmDate, humanizeFilmRunTime, displayRelativeTimeDate };
