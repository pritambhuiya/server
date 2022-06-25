const split = (text, delimiter) => text.split(delimiter);
const hasNoqueries = (uri) => !uri.includes('?');

const splitRequestLine = (requestLine) => {
  const [method, uri, protocol] = split(requestLine, ' ');
  return { method, uri, protocol };
};

const splitHeaders = (headers) => {
  const headerValuePair = {};

  headers.forEach((header) => {
    const [key, value] = split(header, ': ');
    headerValuePair[key.toLowerCase()] = value;
  });

  return headerValuePair;
};

const splitUri = (uri) => {
  const queries = [];
  if (hasNoqueries(uri)) {
    return { resource: uri, queries };
  }

  const [resource, queryString] = split(uri, '?');
  const rawQueries = split(queryString, '&');

  rawQueries.forEach((rawQuery) => {
    const [query, queryParam] = split(rawQuery, '=');
    queries.push({ query, queryParam });
  });

  return { resource, queries };
};

const parseRequest = (request) => {
  const CRLF = '\r\n';
  const [requestLine, ...headers] = request.trim().split(CRLF);

  const { method, uri, protocol } = splitRequestLine(requestLine);
  const { resource, queries } = splitUri(uri);
  const headersObject = splitHeaders(headers);

  return {
    method, protocol, headers: headersObject, resource, queries
  };
};

module.exports = { parseRequest, splitHeaders, splitRequestLine };
