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

const determineStatusMessage = (statusCode) => {
  const messages = { 200: 'OK', 404: 'Not Found' };
  return messages[statusCode];
};

const determineBody = (response) =>
  `<html><body><h1>${response}</h1></body></html>`;

const determineResponse = (uri) => {
  let response = 'unknown';
  if (uri === '/') {
    response = 'hello';
  } else if (uri === '/sai') {
    response = 'playing game';
  }

  return response;
};

const handleRequest = ({ uri, protocol }) => {
  const response = determineResponse(uri);
  const statusCode = determineStatusCode(response);
  const body = determineBody(response);
  const statusMessage = determineStatusMessage(statusCode);

  return `${protocol} ${statusCode} ${statusMessage}${CRLF}${CRLF}${body}`;
};

const onConnection = (socket) => {
  socket.setEncoding('utf8');

  socket.on('data', (usersRequest) => {
    const request = parseRequest(usersRequest);
    console.log(request.method, request.uri);

    const body = handleRequest(request);
    socket.write(body);
    socket.end();
  });
};

module.exports = {
  onConnection, splitRequestLine, splitHeaders, parseRequest, handleRequest,
  determineResponse
};
