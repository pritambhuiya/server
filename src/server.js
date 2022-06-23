const { createServer } = require('net');

const getRequestLine = (requestLine) => {
  const [method, uri, httpVersion] = requestLine.split(' ');
  return { method, uri, httpVersion };
};

const onConnection = (socket) => {
  socket.setEncoding('utf8');

  socket.on('data', (headers) => {
    const headersArray = headers.split('\r\n');
    const { method, uri, httpVersion } = getRequestLine(headersArray[0]);
    console.log(method, uri, httpVersion);

    // console.log(headersArray);
    socket.write('You are connected');
    socket.end();
  });
};

const startServer = (PORT) => {
  const server = createServer(onConnection);
  server.listen(PORT);
};

// startServer(8000);

module.exports = { getRequestLine };
