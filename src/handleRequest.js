const fs = require('fs');
const { Response } = require('./response.js');

const isRoot = (uri) => uri === './public/';

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

const uppercase = ([queries]) => queries.queryParam.toUpperCase();

const add = ([firstNum, secondNum]) =>
  +firstNum.queryParam + +secondNum.queryParam;

const doesHandlerNotExist = (handlers, handler) =>
  Object.keys(handlers).indexOf(handler) < 0;

const isHandlerInvalid = (handlers, handler, queries) =>
  !queries.length || doesHandlerNotExist(handlers, handler);

const dynamicHandler = (response, { resource, queries }) => {
  const handlers = { '/uppercase': uppercase, '/add': add };
  if (isHandlerInvalid(handlers, resource, queries)) {
    return false;
  }

  const handler = handlers[resource];
  const body = handler(queries);

  response.send(`${body}`);
  return true;
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
