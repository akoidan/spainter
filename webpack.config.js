const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const name = '[name].[ext]?[sha512:hash:base64:6]';
const webpack = require('webpack');
const sass = require("node-sass");
const child_process = require('child_process');
const StyleLintPlugin = require('stylelint-webpack-plugin');


module.exports = (env, argv) => {
    let isProd = argv.mode === 'production';
    let isDev = argv.mode === 'development';
    let plugins;
    let sasscPlugins;
    let options = {};
    let gitHash;
    try {
        gitHash = child_process.execSync('git rev-parse --short=10 HEAD', {encoding: 'utf8'});
        gitHash = gitHash.trim();
        options.GIT_HASH = gitHash;
        console.log(`Git hash = ${gitHash}`)
    } catch (e) {
        console.error("Git hash is unavailable");
    }
    plugins = [
        new HtmlWebpackPlugin({template: 'src/index.ejs', inject: false}),
        new StyleLintPlugin({
            files: ['**/*.sass'],
            emitErrors: false,
        }),
    ];
    const entry = ['./src/main.ts'];
    const sassLoader = {
        loader: "sass-loader",
        options: {
            indentedSyntax: true,
            includePaths: [path.resolve(__dirname, 'src/assets/sass')]
        }
    };
    if (isProd) {
        entry.unshift(  'ts-polyfill'); // ie 11 support and es5 syntaxt
        const CleanWebpackPlugin = require('clean-webpack-plugin');
        plugins.push(new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns: ["./dist"]}));
        const MiniCssExtractPlugin = require("mini-css-extract-plugin");
        const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
        const SriPlugin = require('webpack-subresource-integrity');
        plugins.push(new MiniCssExtractPlugin());
        plugins.push(new SriPlugin({
            hashFuncNames: ['sha256', 'sha384'],
            enabled: true,
        }))
        plugins.push(new OptimizeCSSAssetsPlugin({
            cssProcessorOptions: {
                map: {
                    inline: false
                }
            }
        }));
        sasscPlugins = [
            {
                loader: MiniCssExtractPlugin.loader,
            },
            'css-loader',
            sassLoader,
        ];
    } else if (isDev) {
        sasscPlugins = ["style-loader", 'css-loader?sourceMap', sassLoader];
    }
    plugins.push(new webpack.DefinePlugin({
        CONSTS: JSON.stringify(options),
    }));
    const conf = {
        entry,
        plugins,
        resolve: {
            extensions: ['.ts', '.vue', '.json', ".js", '.png', ".sass"],
            alias: {
                '@': path.join(__dirname, 'src')
            }
        },
        output: {
            crossOriginLoading: 'anonymous',
        },
        performance: {
            hints: isProd ? 'warning' : false,
            maxEntrypointSize: 512000,
            maxAssetSize: 2048000
        },
        devtool: '#source-map',
        devServer: {
            historyApiFallback: true
        },
        // optimization: {minimize: true},
        module: {
            rules: [
                {
                    test: /\.html$/i,
                    use: 'raw-loader',
                },
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'ts-loader',
                        },
                        {
                            loader: 'tslint-loader'
                        }
                    ],
                },
                {
                    test: /\.sass$/,
                    use: sasscPlugins,
                },
                { // always save fonts as files, so in case of multiple urls for same font browser only downloads the required one
                    test: /(\.woff2?|\.eot|\.ttf|\.otf|\/fonts(.*)\.svg)(\?.*)?$/,
                    loader: 'file-loader',
                    options: {
                        outputPath: 'font',  // put fonts into separate folder, so we don't have millions of files in root of dist
                        name
                    }
                },
                {
                    test: /(images\/\w+\.svg|images\/\w+\.jpg|images\/\w+\.gif|images\/\w+\.png)$/, //pack image to base64 when its size is less than 16k, otherwise leave it as a file
                    loader: 'url-loader',
                    options: {
                        limit: 16384,
                        outputPath: 'img', // put image into separate folder, so we don't have millions of files in root of dist
                        name
                    }
                },
            ],
        },
    };
    return conf;
};

