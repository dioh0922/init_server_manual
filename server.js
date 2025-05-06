const http = require('http');
const hostname = '0.0.0.0';
const port = 4200;
const fs = require('fs').promises;
const path = require('path');
const url = require('url');
const knexConfig = require('./knexfile'); 
const environment = process.env.NODE_ENV || 'development';
const knex = require('knex')(knexConfig[environment]);

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  try {
    if(pathname === '/init'){

      const manuals = await knex('server_manual').select('*');

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(JSON.stringify(manuals)); 
    }else{
      const filePath = path.join(__dirname, 'template', 'index.html');
      const html = await fs.readFile(filePath, 'utf8');
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(html);  
    }
  } catch (err) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('File Not Found');
    console.error(err);
  }
});

server.listen(port, hostname, () => {
  console.log('runnnin');
})
