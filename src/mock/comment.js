import {getRandomInteger} from '../utils/common.js';

let commentIdCounter = 1;

const generateCommentId = () => commentIdCounter++;

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
    'Ужасный фильм',
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

const generateComment = () => ({
  id: generateCommentId(),
  author: generateAuthor(),
  comment: generateText(),
  date: generateDate(),
  emotion: EMOJIES[getRandomInteger(0, EMOJIES.length-1)],
});

export {commentIdCounter, generateComment};
