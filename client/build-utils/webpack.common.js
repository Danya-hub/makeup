const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const commonPaths = require("./common-paths.js");

module.exports = {
	entry: {
		app: path.resolve(commonPaths.src, "index.js"),
	},
	output: {
		path: commonPaths.build,
		filename: "static/[name].[hash].js",
		publicPath: "/",
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: ["babel-loader"],
			},
			{
				test: /\.(svg|gif|pdf)$/,
				use: ["file-loader"],
			},
		],
	},
	resolve: {
		alias: {
			"@": commonPaths.src,
		},
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				defaultVendors: {
					name: "vendors",
					test: /[\\/]node_modules[\\/]/,
					chunks: "initial",
					reuseExistingChunk: true,
					enforce: true,
				},
				styles: {
					name: "styles",
					test: /\.css$/,
					chunks: "all",
					enforce: true,
				},
			},
		},
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(commonPaths.public, "index.html"),
		}),
		new CleanWebpackPlugin(),
		new Dotenv({
			path: path.resolve(commonPaths.src, ".env")
		}),
	],
};
