'use strict';

describe('Service: Charts', function () {

  // load the service's module
  beforeEach(module('twitterSearchApp'));

  // instantiate service
  var Charts;
  beforeEach(inject(function (_Charts_) {
    Charts = _Charts_;
  }));

  it('should do something', function () {
    expect(!!Charts).toBe(true);
  });

});
