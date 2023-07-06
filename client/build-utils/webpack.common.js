import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import {
	CleanWebpackPlugin
} from "clean-webpack-plugin";
import DotenvPlugin from "dotenv-webpack";

import pathsConfig from "./config/paths.js";

const commonConfig = {
	entry: path.resolve(pathsConfig.src, "index.js"),
	output: {
		path: pathsConfig.build,
		filename: "[name].[contenthash].js",
		publicPath: "/",
	},
	module: {
		rules: [{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: ["babel-loader"],
			},
			{
				test: /\.(svg|png|jpe?g|gif|pdf)$/i,
				loader: "file-loader",
				options: {
					name: "[path][name].[ext]",
				},
			},
		],
	},
	resolve: {
		alias: {
			"@": pathsConfig.src,
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
			template: path.resolve(pathsConfig.publicPath, "index.html"),
		}),
		new CleanWebpackPlugin(),
		new DotenvPlugin({
			path: path.resolve(pathsConfig.src, ".env")
		})
	],
};

export default commonConfig;