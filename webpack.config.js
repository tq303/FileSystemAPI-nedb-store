var path    = require('path'),
    webpack = require('webpack');

var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: './app.js',
    output: { path: __dirname, filename: 'bundle.js' },
    debug: true,
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('css!sass')
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('styles.css', {
            allChunks: true
        })
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};
