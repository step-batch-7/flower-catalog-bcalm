const http = require('http');
const {app} = require('./js/handler');

const port = 80;
const commentFilePath = './dataBase/commentList.json';

const server = new http.Server((req, res) => {
  app.serve(req, res, commentFilePath);
});

server.listen(port);
