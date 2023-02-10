const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { merge } = require("webpack-merge");

const commonConfig = require("./webpack.common.js");

const prodConfig = {
	mode: "production",
	devtool: "source-map",
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
						loader: "css-loader",
						options: {
							modules: true,
							sourceMap: true,
							importLoaders: 1,
							esModule: true,
						},
					},
					{
						loader: "postcss-loader",
					},
				],
			},
		],
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
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
			filename: "styles/style.[hash].css",
		}),
	],
};

module.exports = merge(commonConfig, prodConfig);
