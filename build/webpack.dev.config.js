// path, webpack
const { base, merge, path } = require('./webpack.base.config')

module.exports = merge(base, {
  devtool: 'cheap-module-eval-source-map',
  context: __dirname + "/..src",
  entry: {
    app: "./index.js",
  },
  output: {
    path: __dirname + "/..dist",
    filename: "[name].bundle.js",
  },
})



