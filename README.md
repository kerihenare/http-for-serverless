# HTTP tools for Serverless

Express-like helper for Lambda http events.

Inspired by [Express](https://expressjs.com) and [https://github.com/dougmoscrop/serverless-http](serverless-http).

## Examples

### JSON
```js
var http = require('http-for-serverless');

module.exports.endpoint = http((req, req) => {
  res.json({
    message: `Hello, the current time is ${new Date().toTimeString()}.`,
  });
});
```

### HTML
```js
var http = require('http-for-serverless');

module.exports.endpoint = http((req, req) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>http-for-serverless</title>
      </head>
      <body>
        <p>Hello, the current time is ${new Date().toTimeString()}.</p>
      </body>
    </html>`);
});
```

### React
*react & react-dom are required*
```js
var http = require('http-for-serverless');
var View = require('./views/View');

module.exports.endpoint = http((req, req) => {
  // <DOCTYPE html> is automatically prepended to the rendered component
  // if the output begins with "<html"
  res.render(View, {
    time: new Date().toTimeString()
  });
});
```
