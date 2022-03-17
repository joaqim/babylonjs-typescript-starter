const path = require("path")
const CopyPlugin = require("copy-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: '[name].[contenthash].js',
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".glsl"],
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" },
      { test: /\.glsl$/, loader: "webpack-glsl-loader" },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true, // webpack@1.x
              disable: true, // webpack@2.x and newer
            },
          },
        ],
      }
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "public" },
      ],
    }),
    new HtmlWebpackPlugin({
      template: "!!handlebars-loader!src/index.hbs",
    }),
  ],
}
