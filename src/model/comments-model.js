import {generateComment} from '../mock/comment.js';

export default class CommentsModel {
  comments = Array.from({length: 5}, generateComment);

  getComments = () => this.comments;
}
