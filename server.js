const http = require('http');
const {app} = require('./app');

const port = 80;

const server = new http.Server(app.serve.bind(app));

server.listen(port);
