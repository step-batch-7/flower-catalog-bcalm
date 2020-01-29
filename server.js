const http = require('http');
const {getResponse} = require('./app');

const port = 80;

const handleRequest = function(req, res) {
  let data = '';
  req.setEncoding('utf8');
  req.on('data', chunk => {
    data += chunk;
  });

  req.on('end', () => {
    const {content, statusCode, header} = getResponse(req, data);
    res.writeHead(statusCode, header);
    res.write(content);
    res.end();
  });
};

const server = new http.Server(handleRequest);

server.listen(port);
