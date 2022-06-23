const { createServer, onConnection } = require('./src/server.js');

const startServer = (PORT) => {
  const server = createServer(onConnection);
  server.listen(PORT);
  console.log('Listening to', PORT);
};

startServer(8000);
