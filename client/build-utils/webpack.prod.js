import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import TerserWebpackPlugin from "terser-webpack-plugin";
import {
	merge
} from "webpack-merge";

import common from "./webpack.common.js";

const prodConfig = {
	mode: "production",
	devtool: "source-map",
	module: {
		rules: [{
			test: /\.css$/,
			use: [
				MiniCssExtractPlugin.loader,
				{
					loader: "css-loader",
					options: {
						modules: true,
						sourceMap: true,
						importLoaders: 1,
						esModule: true,
					},
				},
				"postcss-loader",
			],
		}, ],
	},
	optimization: {
		minimizer: [
			new CssMinimizerPlugin(),
			new TerserWebpackPlugin({
				test: /\.js$/,
				extractComments: false,
				terserOptions: {
					toplevel: true,
					output: {
						comments: false,
					},
					mangle: {
						safari10: true,
					},
				},
			}),
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "style.[hash].css",
		}),
	],
};

export default merge(common, prodConfig);