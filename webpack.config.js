const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // Html webpack plugin to copy index from scr to dist and add the script automatically.

module.exports = {
    entry: ["@babel/polyfill", "./src/js/index.js"],
    output: {
        path: path.resolve(__dirname, "dist"), // "__dirname" refers to the current directory, that is, Starter. We join it with the directory where we want out output file to be, which is "dist/js" in this case.
        filename: "js/bundle.js"
    },
    devServer: {
        contentBase: "./dist"
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./src/index.html"
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,   // This means "seek for all files ending in .js"
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    }
}