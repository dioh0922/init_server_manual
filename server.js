const http = require("http");
const hostname = "127.0.0.1";
const port = 42000;
const fs = require('fs').promises;
const path = require('path');

const server = http.createServer(async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'template', 'index.html');
    const html = await fs.readFile(filePath, 'utf8');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(html);
  } catch (err) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('File Not Found');
    console.error(err);
  }
});

server.listen(port, hostname, () => {
  console.log("runnnin");
})
