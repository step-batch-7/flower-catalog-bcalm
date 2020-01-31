const fs = require('fs');

const readFile = function(path, encoding) {
  return JSON.parse(fs.readFileSync(path, encoding));
};

const writeFile = function(path, content) {
  fs.writeFileSync(path, content);
};

const isFileExist = function(filePath) {
  return fs.existsSync(filePath);
};

class Comment {
  constructor(path) {
    this.path = path;
  }
  getComment() {
    if (!isFileExist(this.path)) {
      return [];
    }
    return readFile(this.path, 'utf8');
  }
  save(commentDetail) {
    const commentFile = this.getComment();
    this.date = new Date();
    this.name = commentDetail.name;
    this.comment = commentDetail.comment;
    const {name, comment, date} = this;
    const commentList = {name, date, comment};
    commentFile.unshift(commentList);
    writeFile(this.path, JSON.stringify(commentFile));
  }
}

class CommentFormatter {
  constructor(filePath) {
    this.comment = new Comment(filePath);
  }

  getComment() {
    return this.comment.getComment();
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
