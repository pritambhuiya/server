const assert = require('assert');
const { determineBody } = require('../src/server.js');

describe('determineBody', () => {
  it('Should return hello if uri is /', () => {
    assert.deepStrictEqual(determineBody('/'), 'hello');
  });

  it('Should return hello if uri is /sai', () => {
    assert.deepStrictEqual(determineBody('/sai'), 'playing game');
  });

  it('Should return hello if uri is other than / or /sai', () => {
    assert.deepStrictEqual(determineBody('/said'), 'unknown');
  });
});
