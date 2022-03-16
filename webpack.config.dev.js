const path = require("path")
const { merge } = require("webpack-merge")

const common = require("./webpack.config.common")

module.exports = merge(common, {
    mode: "development",
    //devtool: "inline-source-map",
    devtool: "cheap-source-map",
    optimization: {
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: false
    },
    output: {
      pathinfo: false,
    },
    devServer: {
        compress: true,
        port: 9000,
    },
})
