'use strict';

describe('Service: Query', function () {

  // load the service's module
  beforeEach(module('twitterSearchApp'));

  // instantiate service
  var Query;
  beforeEach(inject(function (_Query_) {
    Query = _Query_;
  }));

  it('should do something', function () {
    expect(!!Query).toBe(true);
  });

});
