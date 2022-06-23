const assert = require('assert');
const { splitRequestLine, splitHeaders, parseRequest } =
  require('../src/server.js');

describe('splitRequestLine', () => {
  it('Should return method, uri, httpVersion as object', () => {
    assert.deepStrictEqual(splitRequestLine('GET / HTTP/1.1'), {
      method: 'GET', uri: '/', protocol: 'HTTP/1.1'
    });

    assert.deepStrictEqual(splitRequestLine('GET /abcd HTTP/1.1'), {
      method: 'GET', uri: '/abcd', protocol: 'HTTP/1.1'
    });
  });
});

describe('splitHeaders', () => {
  it('Should return an object of header, value pair', () => {
    assert.deepStrictEqual(splitHeaders(
      ['Host: localhost:8000', 'User-Agent: curl/7.64.1', 'Accept: */*']), {
      'host': 'localhost:8000', 'user-agent': 'curl/7.64.1', 'accept': '*/*'
    });
  });
});

describe('parseRequest', () => {
  it('Should parse the request', () => {
    assert.deepStrictEqual(parseRequest(
      'GET / HTTP/1.1\r\nHost: localhost:8000\r\n'), {
      method: 'GET', uri: '/', protocol: 'HTTP/1.1',
      headers: { host: 'localhost:8000' }
    });
  });
});
