import webpack from "webpack";
import {
	merge
} from "webpack-merge";

import pathsConfig from "./config/paths.js";
import serverConfig from "./config/server.js";
import common from "./webpack.common.js";

const devConfig = {
	mode: "development",
	devtool: "inline-source-map",
	plugins: [new webpack.HotModuleReplacementPlugin()],
	module: {
		rules: [{
			test: /\.css$/,
			use: ["style-loader", "css-loader"],
		}, ],
	},
	devServer: {
		static: {
			directory: pathsConfig.publicPath,
		},
		historyApiFallback: {
			disableDotRule: true,
		},
		port: serverConfig.port,
		open: true,
		hot: true,
	},
};

export default merge(common, devConfig);