const ALLOWED_DESCRIPTION_LENGTH = 140;

const checkTotalRating = (rating) => rating.toFixed(1);

const checkDescriptionLength = (string) => {
  if (string.length > ALLOWED_DESCRIPTION_LENGTH) {
    return `${string.slice(0, ALLOWED_DESCRIPTION_LENGTH - 1)}...`;
  }

  return string;
};

export { checkTotalRating, checkDescriptionLength };
