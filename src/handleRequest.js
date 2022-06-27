const fs = require('fs');
const { Response } = require('./response.js');

const isRoot = (uri) => uri === '/';

const writeFile = (database, databaseContent) =>
  fs.writeFileSync(database, JSON.stringify(databaseContent), 'utf8');

const fileHandler = (response, { resource }) => {
  const filePath = `./public${resource}`;

  try {
    const body = isRoot(resource) ? 'hello' : fs.readFileSync(filePath);
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
  +firstNum.fieldValue + +secondNum.fieldValue;

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

const signUp = (queries) => {
  const details = saveDetails(queries);
  storeInDatabase(details);
  return 'sign up successful.';
};

const isHandlerInvalid = (handlers, handler, queries) =>
  !handlers[handler] || !queries.length;

const dynamicHandler = (response, { resource, queries }) => {
  const handlers = { '/uppercase': uppercase, '/add': add, '/signUp': signUp };
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
