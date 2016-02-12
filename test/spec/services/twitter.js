'use strict';

describe('Service: Twitter', function () {

  // load the service's module
  beforeEach(module('twitterSearchApp'));

  // instantiate service
  var Twitter;
  beforeEach(inject(function (_Twitter_) {
    Twitter = _Twitter_;
  }));

  it('should do something', function () {
    expect(!!Twitter).toBe(true);
  });

});
