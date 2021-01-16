const {merge} = require('webpack-merge');
const config = require('./webpack.config.base');
const {sassLoader, fileLoader, getDefinitions, getConfig} = require('./utils');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const SriPlugin = require('webpack-subresource-integrity');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(config, {
  mode: 'production',
  stats:  {
    entrypoints: false,
    children: false,
    logging: 'info'
  },
  output: {
    crossOriginLoading: getConfig('APP_FILE_MODE') ? false: 'anonymous',
    publicPath: getConfig('APP_PUBLIC_PATH')
  },
  module: {
    rules: [
      {
        test: /\.(sass|css|scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: getConfig('APP_PUBLIC_PATH'),
            }
          },
          'css-loader',
          sassLoader,
        ],
      },
      fileLoader(getConfig('APP_PUBLIC_PATH'))
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new PreloadWebpackPlugin({
      rel: 'preload',
      as: 'font',
      include: 'allAssets', // it's better to preload fonts, since browser can render the content in required format sooner, so it gives better UX
      fileWhitelist: [/\.woff2/i], // preload font wince it's required all the time https://developers.google.com/speed/pagespeed/insights/?url=https%3A%2F%2Fpychat.org%2F%23%2Fpainter

    }),
    new HtmlWebpackPlugin({
      template: '../src/index.ejs',
      inject: false,
      favicon: '../src/assets/favicon.ico',
      hash: true,
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    }),
    getDefinitions(false),
    new OptimizeCSSAssetsPlugin({
      cssProcessorOptions: {
        map: {
          inline: false
        }
      }
    }),
    new SriPlugin({
      hashFuncNames: ['sha256', 'sha384'],
      enabled: !getConfig('APP_FILE_MODE'),
    }),
    new MiniCssExtractPlugin()
  ]
});
