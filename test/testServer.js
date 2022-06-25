const assert = require('assert');
const { determineBody } = require('../src/server.js');

describe('determineBody', () => {
  it('Should return hello if uri is /', () => {
    assert.deepStrictEqual(determineBody('/'), 'hello');
  });

  it('Should return unknown if uri is other than / or file', () => {
    assert.deepStrictEqual(determineBody('/said'), 'unknown');
  });

  it('Should return unknown if uri directory', () => {
    const filePath = '/pokemon';
    assert.deepStrictEqual(determineBody(filePath), 'unknown');
  });
});
