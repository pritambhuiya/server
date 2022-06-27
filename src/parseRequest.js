const split = (text, delimiter) => text.split(delimiter);
const hasNoqueries = (uri) => !uri.includes('?');
const splitRequest = (request) => request.trim().split('\r\n');

const parseRequestLine = (requestLine) => {
  const [method, uri, protocol] = split(requestLine, ' ');
  return { method, uri, protocol };
};

const parseHeaders = (headers) => {
  const headerValuePair = {};

  headers.forEach((header) => {
    const [key, value] = split(header, ': ');
    headerValuePair[key.toLowerCase()] = value;
  });

  return headerValuePair;
};

const parseQueries = (queries) => {
  const queriesArray = [];

  queries.forEach((query) => {
    const [fieldName, fieldValue] = split(query, '=');
    queriesArray.push({ fieldName, fieldValue });
  });

  return queriesArray;
};

const parseUri = (uri) => {
  if (hasNoqueries(uri)) {
    return { resource: uri, queries: [] };
  }

  const [resource, queryString] = split(uri, '?');
  const rawQueries = split(queryString, '&');

  const queries = parseQueries(rawQueries);
  return { resource, queries };
};

const parseRequest = (request) => {
  const [requestLine, ...rawHeaders] = splitRequest(request);
  const headers = parseHeaders(rawHeaders);

  const { method, uri, protocol } = parseRequestLine(requestLine);
  const { resource, queries } = parseUri(uri);

  return { method, protocol, headers, resource, queries };
};

module.exports = { parseRequest, parseHeaders, parseRequestLine };
