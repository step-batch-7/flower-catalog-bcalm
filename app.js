const fs = require('fs');
const queryString = require('querystring');
const contentTypes = require('./lib/mimeTypes.js');

const STATIC_FOLDER = `${__dirname}/public`;

const fileNotFound = function() {
  const content = `<html>
    <head>
      <title>NOT FOUND</title>
    </head>
    <body>
      <h1>The file which you want to search is not available.</br> </h1>
      <h2>Please go back to home Page<h2>
    </body>
  </html>`;
  const statusCode = 404;
  const contentType = 'text/html';
  return {statusCode, content, contentType};
};

const serveStaticFile = req => {
  req.url = req.url === '/' ? '/html/index.html' : req.url;
  const path = `${STATIC_FOLDER}${req.url}`;
  const stat = fs.existsSync(path) && fs.statSync(path);
  if (!stat || !stat.isFile()) {
    return fileNotFound();
  }
  const [, extension] = path.match(/.*\.(.*)$/) || [];
  const contentType = contentTypes[extension];
  const content = fs.readFileSync(path);
  const statusCode = 200;
  return {statusCode, content, contentType};
};

const createTable = function(commentDetails, commentList) {
  const name = commentList.name.replace(/\r\n/g, '<br/>');
  const comment = commentList.comment.replace(/\r\n/g, '<br/>');
  const date = new Date(commentList.date).toDateString();
  const time = new Date(commentList.date).toLocaleTimeString();
  commentDetails += `
  <tr>
    <td>${date} ${time}</td>
    <td>${name}</td>
    <td>${comment}</td>
  </tr>`;
  return commentDetails;
};

const getComment = function() {
  const filePath = './dataBase/commentList.json';
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const serveGuestPage = function(req) {
  const commentFile = getComment();
  const path = `${STATIC_FOLDER}${req.url}`;
  const guestBook = fs.readFileSync(path, 'utf8');
  const allComment = commentFile.reduce(createTable, '');
  const content = guestBook.replace(/__comment__/, allComment);
  const contentType = 'text/html';
  const statusCode = 200;
  return {statusCode, content, contentType};
};

const updateComment = function(req, data) {
  const path = './dataBase/commentList.json';
  const commentFile = getComment();
  const date = new Date();
  const commentDetail = queryString.parse(data);
  const name = commentDetail.name;
  const comment = commentDetail.comment;
  commentFile.unshift({name, date, comment});
  fs.writeFileSync(path, JSON.stringify(commentFile));
  return serveGuestPage(req);
};

const getHandlers = {
  '/html/guestBook.html': serveGuestPage,
  other: serveStaticFile
};

const postHandlers = {
  '/html/guestBook.html': updateComment
};

const methods = {
  GET: getHandlers,
  POST: postHandlers
};

const getResponse = function(req, data) {
  const handlers = methods[req.method];
  const handler = handlers[req.url] || handlers.other;
  const {statusCode, content, contentType} = handler(req, data);
  const header = {'content-type': contentType || 'text/html'};
  return {content, statusCode, header};
};

module.exports = {getResponse};
