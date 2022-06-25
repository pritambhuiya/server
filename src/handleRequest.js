const fs = require('fs');
const { Response } = require('./response.js');

const isRoot = (uri) => uri === './public/';
const isNotDirectory = (filePath) => !fs.statSync(filePath).isDirectory();

const fileHandler = (response, filePath) => {
  try {
    const body = isRoot(filePath) ? 'hello' : fs.readFileSync(filePath);
    response.send(body);
    return true;

  } catch (error) {
    return false;
  }
};

const notFoundHandler = (response, filePath) => {
  if (!fs.existsSync(filePath) || isNotDirectory(filePath)) {
    response.statusCode = 404;
    response.send('not found');
    return true;
  }

  return false;
};

const dynamicHandler = (response, filePath) => {
  if (filePath === './public/hi') {
    response.send('hi');
    return true;
  }

  return false;
};

const handleRequest = (socket, request) => {
  const response = new Response(socket, request);
  const filePath = `./public${request.uri}`;
  const handlers = [fileHandler, dynamicHandler, notFoundHandler];

  handlers.forEach((handler) => {
    if (handler(response, filePath)) {
      return true;
    }
  });
};

module.exports = { handleRequest, fileHandler };
