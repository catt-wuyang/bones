const path = require("path");
const webpack = require("webpack");
const dllPath = path.join(__dirname, "dll");

module.exports = {
  mode: "production",
  entry: ["react", "react-dom"],
  output: {
    path: dllPath,
    filename: "vendor.[chunkhash].js",
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(dllPath, "manifest.json"),
    }),
    new webpack.ids.DeterministicModuleIdsPlugin({
      maxLength: 5,
    }),
  ],
  optimization: {
    moduleIds: false,
  },
};
