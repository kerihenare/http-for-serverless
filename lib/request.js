'use strict';

const http = require('http');
const url = require('url');

/**
 * Get headers from lambda event
 *
 * @param  {object} event Lambda event
 * @return {object}       Headers
 */
function getHeaders(event) {
  return Object.keys(event.headers).reduce((headers, key) => {
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
function getBody(event) {
  if (typeof event.body === 'object' && !Buffer.isBuffer(event.body)) {
    return JSON.stringify(event.body);
  }

  return event.body;
}

/**
 *
 */
class Request extends http.IncomingMessage {

  /**
   *
   */
  constructor(event, context) {
    super({
      encrypted: true,
      readable: false,
      remoteAddress: event.requestContext.identity.sourceIp
    });

    const headers = getHeaders(event);
    const body = getBody(event);

    if (headers['content-length'] === undefined) {
      headers['content-length'] = Buffer.byteLength(body);
    }

    Object.assign(this, {
      ip: event.requestContext.identity.sourceIp,
      complete: true,
      httpVersion: '1.1',
      httpVersionMajor: '1',
      httpVersionMinor: '1',
      method: event.httpMethod,
      headers: headers,
      url: url.format({
        pathname: event.path,
        query: event.queryStringParameters
      })
    });

    this.push(body);
    this.push(null);
  }

}

module.exports = Request;
