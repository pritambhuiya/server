const { createServer } = require('net');

const splitRequestLine = (requestLine) => {
  const [method, uri, protocol] = requestLine.split(' ');
  return { method, uri, protocol };
};

const splitHeaders = (headers) => {
  const headerValuePair = {};

  headers.map((header) => {
    const [key, value] = header.split(': ');
    headerValuePair[key.toLowerCase()] = value;
  });

  return headerValuePair;
};

const onConnection = (socket) => {
  socket.setEncoding('utf8');

  socket.on('data', (request) => {
    const CRLF = '\r\n';
    const [requestLine, ...headers] = request.trim().split(CRLF);
    const { method, uri, protocol } = splitRequestLine(requestLine);
    const headersObject = splitHeaders(headers);

    console.log({ method, uri, protocol, headers: headersObject });
    socket.write('Got your request');
    socket.end();
  });
};

module.exports = { createServer, onConnection, splitRequestLine, splitHeaders };
