'use strict';

const http = require('http');

/**
 *
 */
class Response {

  /**
   * //
   *
   * @param  {function} callback [description]
   * @param  {Request}  response [description]
   */
  constructor(callback, response) {
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
  json(data) {
    if (!this.get('Content-Type')) {
      this.set('Content-Type', 'application/json');
    }

    this.send(JSON.stringify(data));
  }

  /**
   * Links
   *
   * @param  {object} links [description]
   * @return {*}
   */
  links(links) {
    const link = this.get('Link') || '';

    if (link) {
      link += ', ';
    }

    return this.set('Link', link + Object.keys(links).map(function(rel){
      return '<' + links[rel] + '>; rel="' + rel + '"';
    }).join(', '));
  }

  /**
   * //
   *
   * @param  {string} url   [description]
   * @param  {number} code  [description]
   */
  redirect(url, code) {
    this.set('Location', url);
    this.set('Content-Type', 'text/plain');
    this.status(code);
    this.send('Redirecting to ' + url + '...');
  }

  /**
   * Return HTML reponse
   *
   * @param  {[type]} view  [description]
   * @param  {[type]} props [description]
   */
  render(view, props) {
    const html = ReactDOM.renderToStaticMarkup(React.createElement(view, props));

    if (html.substr(0, 5) === '<html') {
      return this.send('<!DOCTYPE html>' + html);
    }

    this.send(html);
  }

  /**
   * Send reponse
   *
   * @param  {*} body [description]
   */
  send(body) {
    this.set('Content-Length', Buffer.byteLength(body));

    this.callback(null, {
      statusCode: this.statusCode,
      headers: this.headers,
      body
    });
  }

  /**
   * [sendStatus description]
   *
   * @param  {[type]} statusCode [description]
   */
  sendStatus(statusCode) {
    this.status(statusCode);
    this.set('Content-Type', 'text/plain');
    this.send(http.STATUS_CODES[statusCode] || String(statusCode));
  }

  /**
   * //
   *
   * @param  {[type]} name  [description]
   * @param  {[type]} value [description]
   */
  set(name, value) {
    this.headers[name] = value;
  }

  /**
   * [status description]
   *
   * @param  {[type]} statusCode [description]
   */
  status(statusCode) {
    this.statusCode = statusCode;
  }

}

module.exports = Response;
