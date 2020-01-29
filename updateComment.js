const fs = require('fs');
const queryString = require('querystring');

const getComment = function() {
  const filePath = './dataBase/commentList.json';
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const updateComment = function(req, res, next) {
  const path = './dataBase/commentList.json';
  const commentFile = getComment();
  const date = new Date();
  const commentDetail = queryString.parse(req.body);
  const name = commentDetail.name;
  const comment = commentDetail.comment;
  commentFile.unshift({name, date, comment});
  fs.writeFileSync(path, JSON.stringify(commentFile));
  const statusCode = 303;
  res.writeHead(statusCode, {location: 'guestBook.html'});
  res.end();
};

module.exports = {updateComment, getComment};
