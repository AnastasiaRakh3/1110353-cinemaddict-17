import {filter} from '../utils/filter.js';

export const generateFilter = (cards) => Object.entries(filter).map(
  ([filterName, filterCards]) => ({
    name: filterName,
    count: filterCards(cards).length,
  }),
);
