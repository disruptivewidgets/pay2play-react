"use strict";
var webpack = require('webpack');
var path = require('path');
var loaders = require('./webpack.loaders');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var DashboardPlugin = require('webpack-dashboard/plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || "8888";

loaders.push({
  test: /\.scss$/,
  loaders: ['style-loader', 'css-loader?importLoaders=1', 'sass-loader'],
  exclude: ['node_modules']
});


loaders.push({
  test: /\.(woff|woff2)$/,
  use: {
    loader: 'url-loader',
    options: {
      name: 'fonts/[hash].[ext]',
      limit: 5000,
      mimetype: 'application/font-woff'
    }
  }
});
loaders.push({
  test: /\.(ttf|eot|svg)$/,
  use: {
    loader: 'file-loader',
    options: {
      name: 'fonts/[hash].[ext]'
    }
  }
});

// loaders.push({
//   test: /\.(jpe?g|png|gif|svg)$/i,
//   use: {
//     loader: 'file-loader',
//     options: {
//       name: '/icons/[name].[ext]'
//     }
//   }
// });

// loaders.push({
//   test: /\.(jpe?g|png|gif|svg)$/i,
//   loader: "file-loader"
// });

// loaders.push({
//   test: /\.(jpe?g|png|gif|svg)$/i,
//   loader: "file-loader?name=/icons/icons/[name].[ext]"
// });

// loaders.push({
//   test: /\.(jpe?g|png|gif|svg)$/i,
//   use: {
//     loader: 'file-loader',
//     options: {
//       name: 'icons/[hash].[ext]'
//     }
//   }
// });

// loaders.push({
//   test: /\.(jpe?g|png|gif|svg)$/i,
//   loader: "url-loader?name=/images/[name].[ext]"
// });

module.exports = {
  entry: [
    'react-hot-loader/patch',
    './src/index.jsx', // your app's entry point
  ],
  devtool: process.env.WEBPACK_DEVTOOL || 'eval-source-map',
  output: {
    publicPath: '/',
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    loaders
  },
  devServer: {
    contentBase: "./public",
    // do not print bundle build stats
    noInfo: true,
    // enable HMR
    hot: true,
    // embed the webpack-dev-server runtime into the bundle
    inline: true,
    // serve index.html in place of 404 responses to allow HTML5 history
    historyApiFallback: true,
    port: PORT,
    host: HOST
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin({
      filename: 'style.css',
      allChunks: true
    }),
    new DashboardPlugin(),
    new HtmlWebpackPlugin({
      template: './src/template.html',
      files: {
        css: ['style.css'],
        js: [ "bundle.js"],
      }
    }),
    new CopyWebpackPlugin([
      {
        from: 'icons',
        to: 'icons'
      }
    ])
  ]
};
