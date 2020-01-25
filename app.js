const fs = require("fs");
const Response = require("./public/lib/response.js");
const contentTypes = require("./public/lib/mimeTypes.js");

const STATIC_FOLDER = `${__dirname}/public`;

const serveStaticFile = req => {
  const path = `${STATIC_FOLDER}${req.url}`;
  const stat = fs.existsSync(path) && fs.statSync(path);
  if (!stat || !stat.isFile()) return new Response();
  const [, extension] = path.match(/.*\.(.*)$/) || [];
  const contentType = contentTypes[extension];
  const content = fs.readFileSync(path);
  const res = new Response();
  res.setHeader("Content-Type", contentType);
  res.setHeader("Content-Length", content.length);
  res.statusCode = 200;
  res.body = content;
  return res;
};

const serveHomePage = function(req) {
  const html = fs.readFileSync("./public/html/index.html", "utf8");
  const res = new Response();
  res.setHeader("Content-Type", contentTypes.html);
  res.setHeader("Content-Length", html.length);
  res.statusCode = 200;
  res.body = html;
  return res;
};

const processRequest = function(req) {
  console.log(
    req.url,
    "//////////////////////////////////////.................................////////////////////"
  );
  if (req.method === "GET" && req.url === "/") return serveHomePage;
  if (req.method === "GET") return serveStaticFile;
};

module.exports = { processRequest };
