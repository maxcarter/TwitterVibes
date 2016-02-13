'use strict';

describe('Filter: TweetLinky', function () {

  // load the filter's module
  beforeEach(module('twitterSearchApp'));

  // initialize a new instance of the filter before each test
  var TweetLinky;
  beforeEach(inject(function ($filter) {
    TweetLinky = $filter('TweetLinky');
  }));

  it('should return the input prefixed with "TweetLinky filter:"', function () {
    var text = 'angularjs';
    expect(TweetLinky(text)).toBe('TweetLinky filter: ' + text);
  });

});
