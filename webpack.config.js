var webpack = require('webpack');
var path = require('path');
var env = require('yargs').argv.mode;

var plugins = [];

if (env === 'build') {
  plugins = plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      }
    }),
    new webpack.optimize.DedupePlugin(),
  ]);  
}

var config = {
  entry: {
    card: [
      'es6-promise',
      'whatwg-fetch',
      path.resolve(__dirname, './client/card.js')
    ],
  },
  devtool: 'source-map',
  output: {
    path: __dirname + '/public',
    filename: env === 'build' ? '[name].js' : '[name].js',
  },
  module: {
    loaders: [
      {
        test: /(\.js)$/,
        loader: 'babel',
        include: [
          path.resolve(__dirname, 'client'),
          path.resolve(__dirname, 'node_modules/nebo15-mask'),
        ]
      },
      {
        test: /(\.js)$/,
        loader: 'eslint-loader',
        include: [
          path.resolve(__dirname, 'client'),
          path.resolve(__dirname, 'node_modules/nebo15-mask'),
        ]
      }
    ]
  },
  resolve: {
    root: path.resolve('./client'),
    extensions: ['', '.js']
  },
  plugins: plugins
};

module.exports = config;
