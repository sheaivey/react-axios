let webpack = require('webpack')
let path = require('path')

let BUILD_DIR = path.resolve(__dirname, 'lib')
let SRC_DIR = path.resolve(__dirname, 'src')

let config = {
  entry: SRC_DIR + '/index.js',
  output: {
    path: BUILD_DIR,
    filename: 'index.js'
  },
  module : {
    loaders : [
      {
        test : /\.js?/,
        include : SRC_DIR,
        loader : 'babel'
      }
    ]
  }
}

module.exports = config
