// webpack.config.js

let webpack = require('webpack')
let path = require('path')
let libraryName = 'ReactAxios'
let outputFile = 'index.js'

let config = {
  entry: __dirname + '/src/index.js',
  output: {
    path: __dirname + '/lib',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/
      }
    ]
  },
  externals: [
    {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      }
    }
  ],
  node: {
    Buffer: false
  },
  resolve: {
    root: path.resolve('./src'),
    extensions: [ '', '.js' ]
  }
}

module.exports = config
