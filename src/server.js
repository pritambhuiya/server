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

const parseRequest = (request) => {
  const CRLF = '\r\n';
  const [requestLine, ...headers] = request.trim().split(CRLF);

  const { method, uri, protocol } = splitRequestLine(requestLine);
  const headersObject = splitHeaders(headers);

  return { method, uri, protocol, headers: headersObject };
};

const handleRequest = () => {
  const body = '<html><body><h1>Got your request</h1></body></html>';
  return `HTTP/1.1 200 OK\r\n\r\n${body}`;
};

const onConnection = (socket) => {
  socket.setEncoding('utf8');

  socket.on('data', (usersRequest) => {
    const request = parseRequest(usersRequest);
    console.log(request);

    const response = handleRequest(request.uri);
    socket.write(response);
    socket.end();
  });
};

module.exports = {
  createServer, onConnection,
  splitRequestLine, splitHeaders, parseRequest, handleRequest
};
