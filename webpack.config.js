const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: __dirname + "/app/main.jsx",
    output: {
        path: __dirname + "/build",
        filename: "bundle-[hash].js"
    },
    module: {
        loaders: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loaders: ['babel-loader']
        },{
            test: /\.(scss)$/,
            loader: 'style-loader!css-loader!sass-loader'
        },{
            test: /\.(css)$/,
            loader: 'style-loader!css-loader'
        }],
    },
    devServer: {
        // contentBase: "./public",
        // historyApiFallback: true,
        // inline: true,
        // hot: true,
		port: 8088
	},
    plugins: [
        new webpack.BannerPlugin('webpack.BannerPlugin'),
        new HtmlWebpackPlugin({
            template: __dirname + "/app/index.tmpl.html"
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new ExtractTextPlugin("style.css")
    ]
};