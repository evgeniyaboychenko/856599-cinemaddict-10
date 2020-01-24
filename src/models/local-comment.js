export default class LocalComment {
  constructor(date, text, emoji) {
    this.dateComment = date;
    this.textComment = text;
    this.emoji = emoji;
  }

  toRAW() {
    return {
      'date': this.dateComment,
      'comment': this.textComment,
      'emotion': this.emoji
    };
  }
}
