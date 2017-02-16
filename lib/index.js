'use strict';

var Request = require('./request');
var Response = require('./response');

/**
 * [http description]
 *
 * @param  {Function} handler [description]
 * @return {Function}         [description]
 */
function http (handler) {
  return function createHandler (event, context, callback) {
    var req = new Request(event, context);
    var res = new Response(callback, req);

    handler(req, res);
  };
}

module.exports = http;
