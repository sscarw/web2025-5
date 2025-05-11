const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const { program } = require('commander');

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
