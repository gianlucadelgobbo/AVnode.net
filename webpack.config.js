const webpack = require('webpack');
const path = require('path');

const ENV = process.env.NODE_ENV || 'development';

module.exports = {

    mode: ENV,

    context: path.resolve(__dirname, 'app/redux/'),

    entry: './index.js',

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
        extensions: ['.jsx', '.js', '.json']
    },

    module: {
        rules: [
            {test: /\.js$/, use: ['babel-loader'], exclude: /node_modules/},
            {test: /\.(xml|html|txt|md)$/, use: 'raw-loader'},
            {
                test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
                use: ENV === 'production' ? 'file-loader?name=[path][name]_[hash:base64:5].[ext]' : 'url-loader'
            },
            {test: /\.css$/, use: ['style-loader', 'css-loader']},
            {test: /\.scss$/, use: ['style-loader', 'css-loader', "sass-loader"]}
        ]
    },

    plugins: ([
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(ENV)
        })
    ]),

    stats: {colors: true},

    node: {
        global: true,
        process: false,
        Buffer: false,
        __filename: false,
        __dirname: false,
        setImmediate: false
    }
};
