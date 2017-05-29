const path = require("path");

const config = {
  entry: "./src/js/main.js",
  output: {
    path: path.join(__dirname, "docs"),
    filename: "index.js",
  },
  devtool: "source-map"
};

module.exports = config;