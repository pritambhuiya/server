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

const convertIntoUpperCase = (text) => text.toUpperCase();

const dynamicHandler = (response, filePath, query, queryParam) => {
  if (filePath === './public/uppercase' && query) {
    const upperCasedText = convertIntoUpperCase(queryParam);
    response.send(upperCasedText);
    return true;
  }

  return false;
};

const handleRequest = (socket, request) => {
  const response = new Response(socket, request);
  const { resource, query, queryParam } = request;

  const filePath = `./public${resource}`;
  console.log('filePath', filePath);
  const handlers = [fileHandler, dynamicHandler, notFoundHandler];

  handlers.forEach((handler) => {
    if (handler(response, filePath, query, queryParam)) {
      return true;
    }
  });
};

module.exports = { handleRequest, fileHandler };
