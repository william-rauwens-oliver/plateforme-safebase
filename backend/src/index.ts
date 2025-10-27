import { createServer } from './server.js';

const port = Number(process.env.PORT || 8080);
const server = await createServer();
const host = process.env.HOST || '127.0.0.1';

server
  .listen({ port, host })
  .then((address) => {
    server.log.info(`API listening at ${address}`);
  })
  .catch((err) => {
    server.log.error(err);
    process.exit(1);
  });

