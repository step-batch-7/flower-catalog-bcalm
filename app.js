const fs = require('fs');
const {App} = require('./lib/appClass');
const queryString = require('querystring');
const contentTypes = require('./lib/mimeTypes.js');

const STATIC_FOLDER = `${__dirname}/public`;

const fileNotFound = function(req, res, next) {
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
  res.writeHead(statusCode, {'content-type': 'text/html'});
  res.write(content);
  res.end();
};

const isFileExists = function(path) {
  const stat = fs.existsSync(path) && fs.statSync(path);
  return !stat || !stat.isFile();
};

const serveStaticFile = (req, res, next) => {
  req.url = req.url === '/' ? '/html/index.html' : req.url;
  const path = `${STATIC_FOLDER}${req.url}`;
  if (isFileExists(path)) {
    console.log('inside serveStaticFile');
    next();
    return;
  }
  const [, extension] = path.match(/.*\.(.*)$/) || [];
  const contentType = contentTypes[extension];
  const content = fs.readFileSync(path);
  const statusCode = 200;
  res.writeHead(statusCode, {'content-type': contentType});
  res.write(content);
  res.end();
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

const serveGuestPage = function(req, res, next) {
  const commentFile = getComment();
  const path = `${STATIC_FOLDER}${req.url}`;
  if (isFileExists(path)) {
    next();
    return;
  }
  const guestBook = fs.readFileSync(path, 'utf8');
  const allComment = commentFile.reduce(createTable, '');
  const content = guestBook.replace(/__comment__/, allComment);
  const contentType = 'text/html';
  const statusCode = 200;
  res.writeHead(statusCode, {'content-type': contentType});
  res.write(content);
  res.end();
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
  return serveGuestPage(req, res, next);
};

const readBody = function(req, res, next) {
  let data = '';
  req.on('data', chunk => (data += chunk));
  req.on('end', () => {
    req.body = data;
    next();
  });
};

const app = new App();

app.use(readBody);
app.get('/html/guestBook.html', serveGuestPage);
app.get('', serveStaticFile);
app.get('', fileNotFound);

app.post('/html/guestBook.html', updateComment);
app.post('', fileNotFound);

module.exports = {app};
