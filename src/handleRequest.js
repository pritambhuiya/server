/* eslint-disable max-statements */
const fs = require('fs');
const { Response } = require('./response.js');

const isRoot = (uri) => uri === './public/';
const isNotDirectory = (filePath) => !fs.statSync(filePath).isDirectory();
const toUpperCase = (text) => text.toUpperCase();

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

const dynamicHandler = (response, filePath, queries) => {
  if (!queries.length) {
    return false;
  }

  if (filePath === './public/uppercase') {
    const upperCasedText = toUpperCase(queries[0].queryParam);
    response.send(upperCasedText);
    return true;
  }

  if (filePath === './public/add') {
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
  const { resource, queries } = request;

  const filePath = `./public${resource}`;
  const handlers = [fileHandler, dynamicHandler, notFoundHandler];

  handlers.forEach((handler) => {
    if (handler(response, filePath, queries)) {
      return true;
    }
  });
};

module.exports = { handleRequest, fileHandler };
