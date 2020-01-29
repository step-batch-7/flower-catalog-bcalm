const fs = require('fs');
const {App} = require('./lib/app');
const {updateComment, getComment} = require('./updateComment');
const contentTypes = require('./lib/mimeTypes.js');

const STATIC_FOLDER = `${__dirname}/public`;
const isFileExists = function(path) {
  const stat = fs.existsSync(path) && fs.statSync(path);
  return !stat || !stat.isFile();
};

const sendResponse = function(res, content, contentType, statusCode = 200) {
  res.writeHead(statusCode, {'content-type': contentType});
  res.write(content);
  res.end();
};

const fileNotFound = function(req, res, next) {
  const content = fs.readFileSync(`${STATIC_FOLDER}/html/absentFile.html`);
  sendResponse(res, content, 'text/html', 404);
};

const serveStaticFile = (req, res, next) => {
  req.url = req.url === '/' ? '/html/index.html' : req.url;
  const path = `${STATIC_FOLDER}${req.url}`;
  if (isFileExists(path)) return next();
  const [, extension] = path.match(/.*\.(.*)$/) || [];
  const contentType = contentTypes[extension];
  const content = fs.readFileSync(path);
  sendResponse(res, content, contentType);
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

const serveGuestPage = function(req, res, next) {
  const commentFile = getComment();
  const path = `${STATIC_FOLDER}${req.url}`;
  if (isFileExists(path)) return next();
  const guestBook = fs.readFileSync(path, 'utf8');
  const allComment = commentFile.reduce(createTable, '');
  const content = guestBook.replace(/__comment__/, allComment);
  sendResponse(res, content, 'text/html');
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
