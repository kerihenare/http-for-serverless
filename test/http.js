'use strict';

// var assert = require('assert');
var http = require('./../lib');

var handler = http(function (req, res) {
  res.json({ test: 'foobar'});
});

handler({
  headers: {
    'Content-Type': 'application/json',
    'X-Forwarded-For': '1.1.1.1, 2.2.2.2'
  },
  requestContext: {
    identity: {
      sourceIp: {}
    }
  },
  body: '{}'
}, {}, console.log);

/* describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1, 2, 3].indexOf(4));
    });
  });
}); */
