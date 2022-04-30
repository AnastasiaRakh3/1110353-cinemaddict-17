import {getRandomInteger} from '../utils.js';

const COMMENTS_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const generateAuthor = () => {
  const authors = [
    'Уилл Смит',
    'Мистер Дарси',
    'Иван Иванов',
    'Ольга Петрова'
  ];
  const randomIndex = getRandomInteger(0, authors.length - 1);
  return authors[randomIndex];
};

const generateText = () => {
  const texts = [
    'Вах, круто!',
    'Ужвсный фильм',
    'Так себе',
    'Зачет!'
  ];
  const randomIndex = getRandomInteger(0, texts.length - 1);
  return texts[randomIndex];
};

const generateDate = () => {
  const dates = [
    '2021-05-11T16:08:32.554Z',
    '2022-11-30T12:12:32.554Z',
    '2020-03-13T10:10:32.554Z',
    '2019-10-25T21:22:32.554Z'
  ];
  const randomIndex = getRandomInteger(0, dates.length - 1);
  return dates[randomIndex];
};

const EMOJIES = ['smile', 'sleeping', 'puke', 'angry'];

export const generateComment = () => ({
  id: COMMENTS_IDS[getRandomInteger(0, COMMENTS_IDS.length-1)],
  author: generateAuthor(),
  comment: generateText(),
  date: generateDate(),
  emotion: EMOJIES[getRandomInteger(0, EMOJIES.length-1)],
}) ;

