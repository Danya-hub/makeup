const commonPaths = require("./common-paths.js");
const commonConfig = require("./webpack.common.js");
const { merge } = require("webpack-merge");

const PORT = process.env.PORT || 3000;

const devConfig = {
	mode: "development",
	devtool: "inline-source-map",
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
			},
		],
	},
	devServer: {
		static: {
			directory: commonPaths.public,
		},
		historyApiFallback: true,
		port: PORT,
		open: true,
		hot: true,
	},
};

module.exports = merge(commonConfig, devConfig);
