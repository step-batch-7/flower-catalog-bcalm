const redis = require('redis');
const url = process.env.REDIS_URL || '6379';

class Comment {
  constructor(path) {
    this.path = path;
  }
  getComment() {
    const client = redis.createClient(url);
    return new Promise(resolve => {
      client.get('comments', (err, data) => {
        const comment = JSON.parse(data) || [];
        resolve(comment);
      });
      client.quit();
    });
  }
  async save(commentDetail) {
    const commentFile = await this.getComment();
    this.date = new Date();
    this.name = commentDetail.name;
    this.comment = commentDetail.comment;
    const {name, comment, date} = this;
    const commentList = {name, date, comment};
    commentFile.unshift(commentList);
    const client = redis.createClient();
    client.set('comments', JSON.stringify(commentFile));
    client.quit();
  }
}

class CommentFormatter {
  constructor(filePath) {
    this.comment = new Comment(filePath);
  }

  async getComment() {
    return await this.comment.getComment();
  }

  template(commentDetail) {
    this.name = commentDetail.name.replace(/\r\n/g, '<br/>');
    this.comment = commentDetail.comment.replace(/\r\n/g, '<br/>');
    this.date = new Date(commentDetail.date).toDateString();
    this.date += ' ' + new Date(commentDetail.date).toLocaleTimeString();
    return [
      `
  <tr>
    <td>${this.date}</td>
    <td>${this.name}</td>
    <td>${this.comment}</td>
  </tr>`
    ];
  }
}

module.exports = {CommentFormatter, Comment};
