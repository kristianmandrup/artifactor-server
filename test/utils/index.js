require('babel-core/register');
require('babel-polyfill');

const chai = require('chai');
const expect = chai.expect;
chai.should();

function stringify(obj) {
  return JSON.stringify(obj, null, 2)
}

function display(obj) {
  console.log(stringify(obj));
}


// require('./populate');

module.exports = {
  expect,
  display  
}