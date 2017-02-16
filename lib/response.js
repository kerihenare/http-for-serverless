'use strict';

var http = require('http');
var React = require('react');
var ReactDOM = require('react-dom/server');

/**
 * [Response description]
 *
 * @param {Function} callback [description]
 * @param {[type]}   request  [description]
 */
function Response (callback, request) {
  this.callback = callback;
  this.request = request;
  this.statusCode = 200;
  this.headers = {
    'Content-Type': 'text/html'
  };
}

/**
 * Return JSON response
 *
 * @param  {object} data [description]
 */
Response.prototype.json = function json (data) {
  if (!this.get('Content-Type')) {
    this.set('Content-Type', 'application/json');
  }

  this.send(JSON.stringify(data));
};

/**
 * Links
 *
 * @param  {object} links [description]
 * @return {*}
 */
Response.prototype.links = function links (links) {
  var link = this.get('Link') || '';

  if (link) {
    link += ', ';
  }

  return this.set('Link', link + Object.keys(links).map(function (rel) {
    return '<' + links[rel] + '>; rel="' + rel + '"';
  }).join(', '));
};

/**
 * //
 *
 * @param  {string} url   [description]
 * @param  {number} code  [description]
 */
Response.prototype.redirect = function redirect (url, code) {
  this.set('Location', url);
  this.set('Content-Type', 'text/plain');
  this.status(code);
  this.send('Redirecting to ' + url + '...');
};

/**
 * Return HTML reponse
 *
 * @param  {[type]} view  [description]
 * @param  {[type]} props [description]
 */
Response.prototype.render = function render (view, props) {
  var html = ReactDOM.renderToStaticMarkup(React.createElement(view, props));

  if (html.substr(0, 5) === '<html') {
    return this.send('<!DOCTYPE html>' + html);
  }

  this.send(html);
};

/**
 * Send reponse
 *
 * @param  {*} body [description]
 */
Response.prototype.send = function send (body) {
  this.set('Content-Length', Buffer.byteLength(body));

  this.callback(null, {
    statusCode: this.statusCode,
    headers: this.headers,
    body: body
  });
};

/**
 * [sendStatus description]
 *
 * @param  {[type]} statusCode [description]
 */
Response.prototype.sendStatus = function sendStatus (statusCode) {
  this.status(statusCode);
  this.set('Content-Type', 'text/plain');
  this.send(http.STATUS_CODES[statusCode] || String(statusCode));
};

/**
 * //
 *
 * @param  {[type]} name  [description]
 * @param  {[type]} value [description]
 */
Response.prototype.set = function set (name, value) {
  this.headers[name] = value;
};

/**
 * [status description]
 *
 * @param  {[type]} statusCode [description]
 */
Response.prototype.status = function status (statusCode) {
  this.statusCode = statusCode;
};

module.exports = Response;
