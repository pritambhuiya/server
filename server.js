const { createServer } = require('net');
const { handleRequest } = require('./src/handleRequest.js');
const { parseRequest } = require('./src/parseRequest.js');

const onConnection = (socket) => {
  socket.setEncoding('utf8');

  socket.on('data', (usersRequest) => {
    const request = parseRequest(usersRequest);
    console.log(request.method, request.uri);
    handleRequest(socket, request);
  });

  socket.on('error', (err) => console.log(err.message));
};

const startServer = (PORT) => {
  const server = createServer(onConnection);
  server.listen(PORT);
  console.log('Listening to', PORT);
};

startServer(8000);
