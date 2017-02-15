'use strict';

const request = require('./request');
const response = require('./response');

/**
 * [http description]
 *
 * @param  {Function} handler [description]
 * @return {Function}         [description]
 */
function http(handler) {
  const req = request(event, context);
  const res = response(callback, req);

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
