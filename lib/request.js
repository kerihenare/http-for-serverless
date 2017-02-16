'use strict';

var querystring = require('querystring');
var url = require('url');

/**
 * Get headers from lambda event
 *
 * @param  {object} event Lambda event
 * @return {object}       Headers
 */
function getHeaders (event) {
  return Object.keys(event.headers).reduce(function (headers, key) {
    headers[key.toLowerCase()] = event.headers[key];

    return headers;
  }, {});
}

/**
 * Get body from lambda event
 *
 * @param  {object} event Lambda event
 * @return {string}       Body
 */
function getBody (event) {
  if (event.headers['Content-Type'] !== undefined &&
    (event.httpMethod === 'POST' || event.httpMethod === 'PUT')) {
    switch (event.headers['Content-Type']) {
      case 'application/json':
      case 'text/json':
        return JSON.parse(event.body);
      case 'application/x-www-form-urlencoded':
        return querystring.parse(event.body);
    }
  }

  return event.body;
}

/**
 *
 */
function Request (event, context) {
  var headers = getHeaders(event);
  var body = getBody(event);

  if (headers['content-length'] === undefined) {
    headers['content-length'] = Buffer.byteLength(body);
  }

  Object.assign(this, {
    ip: event.requestContext.identity.sourceIp,
    body: body,
    complete: true,
    headers: headers,
    hostname: headers.host,
    ips: headers['x-forwarded-for'].split(', '),
    httpVersion: '1.1',
    httpVersionMajor: '1',
    httpVersionMinor: '1',
    method: event.httpMethod,
    params: event.pathParameters || {},
    path: event.path,
    protocol: headers['cloudfront-forwarded-proto'],
    query: event.queryStringParameters || {},
    route: event.resource,
    secure: event.headers['cloudfront-forwarded-proto'] === 'https',
    url: url.format({
      pathname: event.path,
      query: event.queryStringParameters
    })
  });
}

/**
 * [get description]
 *
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
Request.prototype.get = function (name) {
  if (!name) {
    throw new TypeError('name argument is required to req.get');
  }

  if (typeof name !== 'string') {
    throw new TypeError('name must be a string to req.get');
  }

  var lc = name.toLowerCase();

  switch (lc) {
    case 'referer':
    case 'referrer':
      return this.headers.referrer ||
        this.headers.referer;
    default:
      return this.headers[lc];
  }
};

module.exports = Request;
