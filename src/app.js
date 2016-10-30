// 'babel-polyfill' is needed for async/await.
require('babel-polyfill');

const Koa = require('koa');
const config = require('./config');
const app = new Koa();

// Start the application.
// app.listen(5050, () => console.log('Listening on port 5050.'));

module.exports = function(options = {adapter: 'file'}) {
  console.log('configuring server app:', options);
  return config(app, options);
}