const { parseRequest } = require('./parseRequest.js');
const { Response } = require('./response.js');

const determineStatusCode = (response) => response === 'unknown' ? 404 : 200;

const determineStatusMessage = (statusCode) => {
  const messages = { 200: 'OK', 404: 'Not Found' };
  return messages[statusCode];
};

// const determineBody = (response) =>
//   `<html><body><h1>${response}</h1></body></html>`;

const determineBody = (uri) => {
  let response = 'unknown';
  if (uri === '/') {
    response = 'hello';
  } else if (uri === '/sai') {
    response = 'playing game';
  }

  return response;
};

const handleRequest = (socket, { uri, protocol }) => {
  const body = determineBody(uri);
  const statusCode = determineStatusCode(body);
  const statusMessage = determineStatusMessage(statusCode);

  const CRLF = '\r\n';

  //consider renaming reply to response
  const reply = `${protocol} ${statusCode} ${statusMessage}
  ${CRLF}${CRLF}${body}`;

  const response = new Response(socket);
  response.send(reply);
};

const onConnection = (socket) => {
  socket.setEncoding('utf8');
  socket.on('data', (usersRequest) => {
    const request = parseRequest(usersRequest);

    console.log(request.method, request.uri);
    handleRequest(socket, request);
  });
};

module.exports = { onConnection, handleRequest, determineBody };
