const splitRequestLine = (requestLine) => {
  const [method, uri, protocol] = requestLine.split(' ');
  return { method, uri, protocol };
};

const splitHeaders = (headers) => {
  const headerValuePair = {};

  headers.forEach((header) => {
    const [key, value] = header.split(': ');
    headerValuePair[key.toLowerCase()] = value;
  });

  return headerValuePair;
};

const splitUri = (uri) => {
  if (!uri.includes('?')) {
    return { resource: uri, query: null, queryParam: null };
  }

  const [resource, queryString] = uri.split('?');
  const [query, queryParam] = queryString.split('=');

  return { resource, query, queryParam };
};

const parseRequest = (request) => {
  const CRLF = '\r\n';
  const [requestLine, ...headers] = request.trim().split(CRLF);
  const headersObject = splitHeaders(headers);
  const { method, uri, protocol } = splitRequestLine(requestLine);

  const { resource, query, queryParam } = splitUri(uri);

  return {
    method, protocol, headers: headersObject, resource, query, queryParam
  };
};

module.exports = { parseRequest, splitHeaders, splitRequestLine };
