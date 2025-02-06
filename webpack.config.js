const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');

const ENV = process.env.NODE_ENV || 'development';

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        clean: true
    },
    resolve: {
        modules: [
            path.join(__dirname, 'app/redux'),
            'node_modules'
        ],
        extensions: ['.jsx', '.js', '.json']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {test: /\.(xml|html|txt|md)$/, use: 'raw-loader'},
            {
                test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
                use: ENV === 'production' ? 'file-loader?name=[path][name]_[hash:base64:5].[ext]' : 'url-loader'
            },
            {test: /\.css$/, use: ['style-loader', 'css-loader']},
            {test: /\.scss$/, use: ['style-loader', 'css-loader', "sass-loader"]}
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(ENV)
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new PreloadWebpackPlugin({
            rel: 'preload',
            include: 'allAssets'
        })
    ],
    stats: {
        errorDetails: true
    },
    node: {
        __dirname: false,
        __filename: false,
        global: true
    },
    target: 'web',
    optimization: {
        minimize: false
    }
};
