const fs = require('fs');
const { Response } = require('./response.js');

const isRoot = (uri) => uri === '/';

const serverFile = (filePath) => {
  try {
    return fs.readFileSync(filePath);
  } catch (error) {
    return 'unknown';
  }
};
const fileHandler = ({ uri }) => {
  const filePath = `./public${uri}`;
  return isRoot(uri) ? 'hello' : serverFile(filePath);
};

const handleRequest = (socket, request) => {
  const response = new Response(socket, request);
  const body = fileHandler(request);

  if (body === 'unknown') {
    response.statusCode = 404;
  }
  response.send(body);
};

module.exports = { handleRequest, fileHandler };
