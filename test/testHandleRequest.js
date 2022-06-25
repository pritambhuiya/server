const assert = require('assert');
const { fileHandler } = require('../src/handleRequest.js');

describe('fileHandler', () => {
  it('Should return hello if uri is /', () => {
    assert.deepStrictEqual(fileHandler({ uri: '/' }), 'hello');
  });

  it('Should return unknown if uri is other than / or file', () => {
    assert.deepStrictEqual(fileHandler({ uri: '/said' }), 'unknown');
  });

  it('Should return unknown if uri directory', () => {
    assert.deepStrictEqual(fileHandler({ uri: '/pokemon' }), 'unknown');
  });
});
