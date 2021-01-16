module.exports = {
  mode: "development",
  module: {
    rules: [
      {
        exclude: [/node_modules/u],
        test: /\.ts$/u,
        use: [{loader: "ts-loader",}],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};
