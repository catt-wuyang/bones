const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const ENV = process.env.NODE_ENV || "development";
const isProd = ENV === "production";

const config = {
  mode: ENV,
  entry: {
    app: "./src/index.js",
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: isProd ? "[name].bundle.[chunkhash].js" : "[name].bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_module/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },
      {
        test: /\.(sc|c)ss$/i,
        use: [
          {
            loader: isProd ? MiniCssExtractPlugin.loader : "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: isProd,
            },
          },
          "postcss-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: isProd,
            },
          },
        ],
      },
      // {
      //   test: /\.(png|jpg|svg|gif)$/,
      //   use: {
      //     loader: "url-loader",
      //     options: {
      //       limit: 10240,
      //       name: "assets/[name].[ext]?[chunkhash]",
      //     },
      //   },
      // },
    ],
  },
  plugins: [
    // new webpack.DllReferencePlugin({
    //   manifest: require(path.join(__dirname, "dll/manifest.json")),
    // }),
    new HtmlWebpackPlugin({
      template: "src/index.html",
      filename: "index.html",
      inject: "body",
      minify: {
        removeComments: true,
      },
    }),
    new ESLintPlugin({
      context: path.join(__dirname, "src"),
    }),
  ],
  // optimization: {
  //   runtimeChunk: "single",
  //   splitChunks: {
  //     chunks: "all",
  //     cacheGroups: {
  //       vendor: {
  //         test: /[\\/]node_modules[\\/]/,
  //         name: "vendors",
  //         enforce: true,
  //       },
  //     },
  //   },
  // },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".scss"],
    modules: [path.join(__dirname, "src"), "node_modules"],
    alias: {
      "@components": path.join(__dirname, "src/components"),
    },
  },
  target: "web",
};

if (isProd) {
  config.devtool = "source-map";
  config.entry.vendor = ["react", "react-dom"];

  config.plugins.push(
    new CleanWebpackPlugin({
      protectWebpackAssets: false,
      cleanAfterEveryBuildPatterns: ["*.LICENSE.txt"],
    }),
    new MiniCssExtractPlugin({
      filename: "[name].bundle.[chunkhash].css",
      chunkFilename: "[id].css",
    })
    // new webpack.SourceMapDevToolPlugin({
    //   filename: "[file].map",
    //   exclude: ["vendor/*.js"],
    // }),
  );

  config.optimization = {
    minimize: true,
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
  };
} else {
  config.devtool = "eval-cheap-module-source-map";
  config.devServer = {
    allowedHosts: ["localhost.charlesproxy.com"],
    historyApiFallback: true,
    hot: true,
    port: 3001,
  };
}

module.exports = config;
