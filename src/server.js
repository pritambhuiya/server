const { parseRequest } = require('./parseRequest.js');
const { Response } = require('./response.js');

// const determineBody = (response) =>
//   `<html><body><h1>${response}</h1></body></html>`;

const determineBody = (uri) => {
  let body = 'unknown';
  if (uri === '/') {
    body = 'hello';
  } else if (uri === '/sai') {
    body = 'playing game';
  }

  return body;
};

const handleRequest = (socket, request) => {
  const response = new Response(socket, request);
  const body = determineBody(request.uri);

  if (body === 'unknown') {
    response.statusCode = 404;
  }

  response.send(body);
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
