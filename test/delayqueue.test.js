'use strict';

const mock = require('egg-mock');

describe('test/delayqueue.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/delayqueue-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, delayqueue')
      .expect(200);
  });
});
