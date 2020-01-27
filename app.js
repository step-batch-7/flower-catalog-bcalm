const fs = require('fs');
const Response = require('./lib/response.js');
const contentTypes = require('./lib/mimeTypes.js');

const STATIC_FOLDER = `${__dirname}/public`;

const createResponse = function(content, contentType, statusCode) {
  const res = new Response();
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Length', content.length);
  res.statusCode = statusCode;
  res.body = content;
  return res;
};

// eslint-disable-next-line complexity
const serveStaticFile = req => {
  if (req.url === '/') {
    req.url = '/html/index.html';
  }

  const path = `${STATIC_FOLDER}${req.url}`;
  const stat = fs.existsSync(path) && fs.statSync(path);
  if (!stat || !stat.isFile()) {
    return new Response();
  }

  const [, extension] = path.match(/.*\.(.*)$/) || [];
  const contentType = contentTypes[extension];
  const content = fs.readFileSync(path);
  return createResponse(content, contentType, 200);
};

const parseContent = function(content) {
  const formattedContent = {};
  formattedContent.name = content.name.replace(/\+/g, ' ');
  formattedContent.name = decodeURIComponent(formattedContent.name);
  formattedContent.comment = content.comment.replace(/\+/g, ' ');
  formattedContent.comment = decodeURIComponent(formattedContent.comment);
  formattedContent.date = content.date;
  return formattedContent;
};

const createContent = function(commentDetails, commentList) {
  const name = commentList.name.replace(/\r\n/, '<br/>');
  const comment = commentList.comment.replace(/\r\n/, '<br/>');
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

// eslint-disable-next-line max-statements
const updateComment = function(req) {
  const commentFile = JSON.parse(fs.readFileSync('./dataBase/commentList.json', 'utf8'));
  if (req.method === 'POST') {
    const name = req.body.name;
    const comment = req.body.comment;
    const date = new Date();
    const commentDetail = parseContent({name, comment, date});
    commentFile.unshift(commentDetail);
    fs.writeFileSync('./dataBase/commentList.json', JSON.stringify(commentFile));
  }
  const guestBook = fs.readFileSync('./public/html/guestBook.html', 'utf8');
  const content = commentFile.reduce(createContent, '');
  const html = guestBook.replace(/__comment__/, content);
  const res = new Response();
  res.setHeader('Content-Type', contentTypes.html);
  res.setHeader('Content-Length', html.length);
  res.statusCode = 200;
  res.body = html;
  return res;
};

const processRequest = function(req) {
  if (req.url === '/html/guestBook.html') {
    return updateComment;
  }
  if (req.method === 'GET') {
    return serveStaticFile;
  }
};

module.exports = {processRequest};
