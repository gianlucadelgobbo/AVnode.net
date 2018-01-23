const webpack = require('webpack');
const path = require('path');
//const CopyWebpackPlugin = require('copy-webpack-plugin');
//const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

/*
import ReplacePlugin from 'replace-bundle-webpack-plugin';
import V8LazyParseWebpackPlugin from 'v8-lazy-parse-webpack-plugin';
*/
const ENV = process.env.NODE_ENV || 'development';

module.exports = {
  context: path.resolve(__dirname, 'app/redux/'),
  entry: [
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
    './index.js'
  ],

  output: {
    path: path.resolve(__dirname, 'public/js'),
    publicPath: '/js/',
    filename: 'bundle.js'
  },

  resolve: {
    modules: [
      path.join(__dirname, 'app/redux'),
      'node_modules'
    ],
    extensions: ['.jsx', '.js', '.json'],
    alias: {
      components: path.resolve(__dirname, 'app/redux/src/components'),    // used for tests
      style: path.resolve(__dirname, 'app/redux/src/style'),
      'react': 'preact-compat',
      'react-dom': 'preact-compat'
    }
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    },{
      test: /\.(xml|html|txt|md)$/,
      loader: 'raw-loader'
    },{
      test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
      loader: ENV==='production' ? 'file?name=[path][name]_[hash:base64:5].[ext]' : 'url-loader'
    }]
  },
  plugins: ([
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(ENV)
    }),
    new webpack.HotModuleReplacementPlugin()
    //new webpack.optimize.OccurenceOrderPlugin()
    /*
    new ScriptExtHtmlWebpackPlugin({
    defaultAttribute: "async"
  }),
    new CopyWebpackPlugin()
    */
  ]).concat(ENV==='production' ? [
    /*
    new V8LazyParseWebpackPlugin(),
    */
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      },
      compress: {
        warnings: false,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        negate_iife: false
      }
    }),
    // strip out babel-helper invariant checks
    /*
    new ReplacePlugin([{
    // this is actually the property name https://github.com/kimhou/replace-bundle-webpack-plugin/issues/1
    partten: /throw\s+(new\s+)?[a-zA-Z]+Error\s*\(/g,
    replacement: () => 'return;('
  }]),
    */
  ] : []),

  stats: { colors: true },

  node: {
    global: true,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
    setImmediate: false
  },
  devtool: ENV==='production' ? 'source-map' : 'cheap-module-eval-source-map'
};
