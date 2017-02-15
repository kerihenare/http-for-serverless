'use strict';

var Request = require('./request');
var Response = require('./response');

/**
 * [http description]
 *
 * @param  {Function} handler [description]
 * @return {Function}         [description]
 */
function http(handler) {
  var req = new Request(event, context);
  var res = new Response(callback, req);

  /**
   * [description]
   *
   * @param  {[type]}   event    [description]
   * @param  {[type]}   context  [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  return function createHandler(event, context, callback) {
    handler(req, res);
  };
}

module.exports = http;
