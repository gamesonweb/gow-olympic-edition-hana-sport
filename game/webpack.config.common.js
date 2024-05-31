const path = require("path")
const CopyPlugin = require("copy-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const webpack = require('webpack');

module.exports = {
    entry: "./src/index.tsx",
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: '[name].[contenthash].js',
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".glsl"],
    },
    module: {
        rules: [
            {test: /\.tsx?$/, loader: "ts-loader"},
            {test: /\.glsl$/, loader: "webpack-glsl-loader"},
            {test: /\.wasm$/, type: "webassembly/async"},
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(jpg|png|svg|gif)$/,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {from: "public"},
            ],
        }),
        new HtmlWebpackPlugin({
            template: "!!handlebars-loader!src/index.hbs",
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
        new CopyPlugin({
            // copy node_modules/@babylonjs/havok/lib/esm/HavokPhysics.wasm
            patterns: [
                {from: "node_modules/@babylonjs/havok/lib/esm/HavokPhysics.wasm"},
            ],
        })
    ],
    experiments: {
        asyncWebAssembly: true,
        syncWebAssembly: true,
    }
}