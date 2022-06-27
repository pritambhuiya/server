const fs = require('fs');
const { Response } = require('./response.js');

const isRoot = (path) => path === '/';

const writeFile = (database, databaseContent) =>
  fs.writeFileSync(database, JSON.stringify(databaseContent), 'utf8');

const fileHandler = ({ resource }, response) => {
  const filePath = './public' + resource;

  try {
    const body = isRoot(resource) ? 'hello' : fs.readFileSync(filePath);
    response.send(body);
    return true;

  } catch (error) {
    return false;
  }
};

const notFoundHandler = (request, response) => {
  response.statusCode = 404;
  response.send('not found');
  return true;
};

const uppercase = ([queries], response) => {
  const upperCasedText = queries.fieldValue.toUpperCase();
  response.send(upperCasedText);
  return true;
};

const add = ([firstNum, secondNum], response) => {
  const sum = +firstNum.fieldValue + +secondNum.fieldValue;
  response.send('' + sum);
  return true;
};

const saveDetails = (queries) => {
  const details = {};

  queries.forEach(({ fieldName, fieldValue }) => {
    details[fieldName] = fieldValue;
  });

  return details;
};

const storeInDatabase = (details) => {
  const database = './.data/details.json';
  const databaseContent = JSON.parse(fs.readFileSync(database, 'utf8'));

  databaseContent[details.id] = details;
  writeFile(database, databaseContent);
};

const signUp = (queries, response) => {
  const details = saveDetails(queries);
  storeInDatabase(details);

  response.send('sign up successful.');
  return true;
};

const isHandlerInvalid = (handlers, handler, queries) =>
  !handlers[handler] || !queries.length;

const dynamicHandler = ({ resource, queries }, response) => {
  const handlers = { '/uppercase': uppercase, '/add': add, '/signUp': signUp };
  if (isHandlerInvalid(handlers, resource, queries)) {
    return false;
  }

  const handler = handlers[resource];
  return handler(queries, response);
};

const handleRequest = (request, socket) => {
  const response = new Response(socket, request);
  const handlers = [fileHandler, dynamicHandler, notFoundHandler];

  handlers.forEach((handler) => {
    if (handler(request, response)) {
      return true;
    }
  });
};

module.exports = { handleRequest, fileHandler };
