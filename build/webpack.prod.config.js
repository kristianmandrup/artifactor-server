// Note: To create production ready bundle: `webpack -p`

const { base, merge, path } = require('./webpack.base.config')

module.exports = merge(base, {
  devtool: 'source-map',
  output: {
    filename: '[name].prod.js'
  }
}
