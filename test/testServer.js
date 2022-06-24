const assert = require('assert');
const { splitRequestLine, splitHeaders, parseRequest, handleRequest } =
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
      'GET / HTTP/1.1\r\nHost: localhost:8000\r\nAccept: */*'), {
      method: 'GET', uri: '/', protocol: 'HTTP/1.1',
      headers: { host: 'localhost:8000', accept: '*/*' }
    });
  });
});

describe('handleRequest', () => {
  it('Should send hello as response if uri is /', () => {
    assert.deepStrictEqual(handleRequest({ uri: '/' }),
      'HTTP/1.1 200 OK\r\n\r\n<html><body><h1>hello</h1></body></html>');
  });

  it('Should send playing game as response if uri is sai', () => {
    assert.deepStrictEqual(handleRequest({ uri: '/sai' }),
      'HTTP/1.1 200 OK\r\n\r\n<html><body><h1>playing game</h1></body></html>');
  });

  it('Should send unknown as response if uri is invalid', () => {
    assert.deepStrictEqual(handleRequest({ uri: '/a' }),
      'HTTP/1.1 200 OK\r\n\r\n<html><body><h1>unknown</h1></body></html>');
  });
});
