const path = require('path');
const webpack = require('webpack');
const ENV = process.env.NODE_ENV || 'development';

module.exports = {

    mode: ENV,

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
            style: path.resolve(__dirname, 'app/redux/src/style')
        }
    },

    module: {
        rules: [{
            test: /\.jsx?$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.(xml|html|txt|md)$/,
            loader: 'raw-loader'
        }, {
            test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
            loader: ENV === 'production' ? 'file-loader?name=[path][name]_[hash:base64:5].[ext]' : 'url-loader'
        },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', "sass-loader"]
            }]
    },

    plugins: ([
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(ENV)
        }),
        new webpack.HotModuleReplacementPlugin()
    ]).concat(ENV === 'production' ? [
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
    ] : []),
};