import { createServer } from 'node:http';

import DataInterface from './DataInterface';

const server = createServer((req, res) => {
  console.log(req.method, req.url, req.headers);
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    console.log(data);
  });

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      data: 'Hello World!'
    })
  );
});

server.listen(8000);

export { DataInterface };
