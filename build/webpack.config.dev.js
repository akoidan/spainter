const {merge} = require('webpack-merge');
const {sassLoader, fileLoader, getDefinitions} = require('./utils');
const config = require('./webpack.config.base');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanTerminalPlugin = require('clean-terminal-webpack-plugin');

module.exports = merge(config, {
  mode: 'development',
  stats: 'minimal',
  output: {
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.(sass|css|scss)$/,
        use: ["style-loader", 'css-loader?sourceMap', sassLoader],
      },
      fileLoader("/")
    ]
  },
  devServer: {
    disableHostCheck: true, // allow joining under different hostnames to dev server, like ngrok
  },
  plugins: [
    new CleanTerminalPlugin(),
    getDefinitions(true),
    new HtmlWebpackPlugin({
      template: '../src/index.ejs',
      favicon: '../src/assets/favicon.ico',
      inject: false
    })
  ]
});
