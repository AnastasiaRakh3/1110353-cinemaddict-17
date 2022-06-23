const ALLOWED_DESCRIPTION_LENGTH = 140;

const formatTotalRating = (rating) => rating.toFixed(1);

const formatDescription = (string) => {
  if (string.length > ALLOWED_DESCRIPTION_LENGTH) {
    return `${string.slice(0, ALLOWED_DESCRIPTION_LENGTH - 1)}...`;
  }

  return string;
};

const getGenreTitle = (genres) => genres.length > 1 ? 'Genres' : 'Genre';

const getDisabledState = (isDisabled) => isDisabled ? 'disabled' : '';

export { formatTotalRating, formatDescription, getGenreTitle, getDisabledState };
