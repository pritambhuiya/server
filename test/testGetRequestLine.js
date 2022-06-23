const assert = require('assert');
const { getRequestLine } = require('../src/server.js');

describe('getRequestLine', () => {
  it('Should return method, uri, httpVersion as object', () => {
    assert.deepStrictEqual(getRequestLine('GET / HTTP/1.1'), {
      method: 'GET', uri: '/', httpVersion: 'HTTP/1.1'
    });

    assert.deepStrictEqual(getRequestLine('GET /abcd HTTP/1.1'), {
      method: 'GET', uri: '/abcd', httpVersion: 'HTTP/1.1'
    });
  });
});
