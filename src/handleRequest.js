/* eslint-disable max-statements */
const fs = require('fs');
const { Response } = require('./response.js');

const isRoot = (uri) => uri === './public/';
const toUpperCase = (text) => text.toUpperCase();

const fileHandler = (response, { resource }) => {
  const filePath = `./public${resource}`;

  try {
    const body = isRoot(filePath) ? 'hello' : fs.readFileSync(filePath);
    response.send(body);
    return true;

  } catch (error) {
    return false;
  }
};

const notFoundHandler = (response) => {
  response.statusCode = 404;
  response.send('not found');
  return true;
};

const dynamicHandler = (response, { resource, queries }) => {
  if (!queries.length) {
    return false;
  }

  if (resource === '/uppercase') {
    const upperCasedText = toUpperCase(queries[0].queryParam);
    response.send(upperCasedText);
    return true;
  }

  if (resource === '/add') {
    const firstNumber = +queries[0].queryParam;
    const secondNumber = +queries[1].queryParam;
    const addition = firstNumber + secondNumber;

    response.send(`${addition}`);
    return true;
  }

  return false;
};

const handleRequest = (socket, request) => {
  const response = new Response(socket, request);
  const handlers = [fileHandler, dynamicHandler, notFoundHandler];

  handlers.forEach((handler) => {
    if (handler(response, request)) {
      return true;
    }
  });
};

module.exports = { handleRequest, fileHandler };
