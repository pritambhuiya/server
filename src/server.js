const splitRequestLine = (requestLine) => {
  const [method, uri, protocol] = requestLine.split(' ');
  return { method, uri, protocol };
};

const splitHeaders = (headers) => {
  const headerValuePair = {};

  headers.forEach((header) => {
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

const getStatusCode = (response) => response === 'unknown' ? 404 : 200;

const handleRequest = ({ uri, protocol }) => {
  let response = 'unknown';
  if (uri === '/') {
    response = 'hello';
  } else if (uri === '/sai') {
    response = 'playing game';
  }

  const statusCode = getStatusCode(response);

  const body = `<html><body><h1>${response}</h1></body></html>`;
  return `${protocol} ${statusCode} OK\r\n\r\n${body}`;
};

const onConnection = (socket) => {
  socket.setEncoding('utf8');

  socket.on('data', (usersRequest) => {
    const request = parseRequest(usersRequest);
    console.log(request.method, request.uri);

    const response = handleRequest(request);
    socket.write(response);
    socket.end();
  });
};

module.exports = {
  onConnection, splitRequestLine, splitHeaders, parseRequest, handleRequest
};
