const CRLF = '\r\n';

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
  const [requestLine, ...headers] = request.trim().split(CRLF);

  const { method, uri, protocol } = splitRequestLine(requestLine);
  const headersObject = splitHeaders(headers);

  return { method, uri, protocol, headers: headersObject };
};

const determineStatusCode = (response) => response === 'unknown' ? 404 : 200;

const determineBody = (response) =>
  `<html><body><h1>${response}</h1></body></html>`;

const handleRequest = ({ uri, protocol }) => {
  let response = 'unknown';
  if (uri === '/') {
    response = 'hello';
  } else if (uri === '/sai') {
    response = 'playing game';
  }

  const statusCode = determineStatusCode(response);
  const body = determineBody(response);

  return `${protocol} ${statusCode} OK${CRLF}${CRLF}${body}`;

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
