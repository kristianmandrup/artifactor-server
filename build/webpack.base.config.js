const nodeExternals = require('webpack-node-externals')
const merge = require('lodash.merge')
const path = require('path')
const webpack = require('webpack')

const base = {
  // devtool: 'source-map',
  target: 'node', // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'eslint'
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          babelrc: true,
          cacheDirectory: true
        }
      }
    ]
  }
}

module.exports = {
  base,
  merge,
  path,
  webpack
}
