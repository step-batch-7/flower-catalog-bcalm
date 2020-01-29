const fs = require('fs');
const queryString = require('querystring');

class Comment {
  constructor() {
    this.name = '';
    this.comment = '';
    this.date = '';
    this.path = './dataBase/commentList.json';
  }
  getComment() {
    if (!fs.existsSync(this.path)) {
      return [];
    }
    return JSON.parse(fs.readFileSync(this.path, 'utf8'));
  }
  save(data) {
    const commentFile = this.getComment();
    this.date = new Date();
    const commentDetail = queryString.parse(data);
    this.name = commentDetail.name;
    this.comment = commentDetail.comment;
    const {name, comment, date} = this;
    const commentList = {name, date, comment};
    commentFile.unshift(commentList);
    fs.writeFileSync(this.path, JSON.stringify(commentFile));
  }
}

class CommentFormatter {
  constructor() {
    this.comment = new Comment();
  }

  getComment() {
    return this.comment.getComment();
  }

  template(commentDetail) {
    this.name = commentDetail.name.replace(/\r\n/g, '<br/>');
    this.comment = commentDetail.comment.replace(/\r\n/g, '<br/>');
    this.date = new Date(commentDetail.date).toDateString();
    this.date += new Date(commentDetail.date).toLocaleTimeString();
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
