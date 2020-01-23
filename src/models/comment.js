export default class Comment {
  constructor(data) {
    this.id = data[`id`];
    this.autorComment = data[`author`];
    this.dateComment = data[`date`];
    this.textComment = data[`comment`];
    this.emoji = data[`emotion`];
  }

  toRAW() {
    return {
      'id': this.id,
      'author': this.autorComment,
      'comment': this.textComment,
      'date': this.dateComment,
      'emotion': this.emoji
    };
  }

  static parseComment(data) {
    return new Comment(data);
  }

  static parseComments(data) {
    return data.map(Comment.parseComment);
  }

  static clone(data) {
    return new Comment(data.toRAW());
  }
}
