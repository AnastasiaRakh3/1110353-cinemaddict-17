import { FilterType } from '../const.js';

const filter = {
  [FilterType.ALL]: (cards) => cards,
  [FilterType.WATCHLIST]: (cards) => cards.filter((card) => card.userDetails.watchlist),
  [FilterType.HISTORY]: (cards) => cards.filter((card) => card.userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (cards) => cards.filter((card) => card.userDetails.favorite),
};

export { filter };
