const fs = require('fs');
const { parseRequest } = require('./parseRequest.js');
const { Response } = require('./response.js');

const serverFile = (path) => fs.readFileSync(path);
const isRootDirectory = (uri) => uri === '/';

const fileHandler = (filePath) => {
  try {
    return serverFile(filePath);
  } catch (error) {
    return 'unknown';
  }
};

const determineBody = (uri) => {
  const filePath = `./public${uri}`;
  return isRootDirectory(uri) ? 'hello' : fileHandler(filePath);
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

  socket.on('error', (err) => console.log(err));
};

module.exports = { onConnection, handleRequest, determineBody };
