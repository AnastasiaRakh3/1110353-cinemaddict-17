const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

const SortType = {
  DEFAULT: 'default',
  DATE_UP: 'date',
  RATING: 'rating',
};

const Emotion = {
  SMILE: 'smile',
  SLEEPING: 'sleeping',
  PUKE: 'puke',
  ANGRY: 'angry',
};

const UserAction = {
  UPDATE_CARD: 'UPDATE_CARD',
  UPDATE_POPUP: 'UPDATE_POPUP',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const Extra = {
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
};

export {FilterType, SortType, Emotion, UserAction, UpdateType, Extra};
