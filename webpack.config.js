const path = require("path");

module.exports = {
  context: __dirname,
  entry: "./lib/mazr.js",
  output: {
    filename: "bundle.js",
    devtoolModuleFilenameTemplate: '[resourcePath]',
    devtoolFallbackModuleFilenameTemplate: '[resourcePath]?[hash]'
  },
  externals: {
    "jquery": "jQuery"
  },
  devtool: 'source-maps',
};
