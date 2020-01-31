const http = require('http');
const {app} = require('./js/handler');

const port = 80;

const server = new http.Server((req, res) => {
  app.serve(req, res);
});

server.listen(port);
