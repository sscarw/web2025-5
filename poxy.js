const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const { program } = require('commander');
const url = require('url');

program
  .requiredOption('-h, --host <host>', 'Server host')
  .requiredOption('-p, --port <port>', 'Server port')
  .requiredOption('-c, --cache <dir>', 'Cache directory');

program.parse(process.argv);
const options = program.opts();

const { host, port, cache } = options;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Proxy server running');
});

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
server.on('request', async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const code = parsedUrl.pathname.replace('/', '');
  const filePath = path.join(cache, `${code}.jpg`);

  try {
    if (req.method === 'GET') {
      const data = await fs.readFile(filePath);
      res.writeHead(200, { 'Content-Type': 'image/jpeg' });
      res.end(data);
    } else if (req.method === 'PUT') {
      let body = [];
      req.on('data', chunk => body.push(chunk));
      req.on('end', async () => {
        await fs.writeFile(filePath, Buffer.concat(body));
        res.writeHead(201);
        res.end('Created');
      });
    } else if (req.method === 'DELETE') {
      await fs.unlink(filePath);
      res.writeHead(200);
      res.end('Deleted');
    } else {
      res.writeHead(405);
      res.end('Method not allowed');
    }
  } catch (err) {
    res.writeHead(404);
    res.end('Not found');
  }
});
