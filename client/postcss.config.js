import PostcssPresetEnv from "postcss-preset-env";
import Cssnano from "cssnano";
import Autoprefixer from "autoprefixer";

const config = {
	plugins: [
		PostcssPresetEnv({
			browsers: [">0.25%", "not ie 11", "not op_mini all"],
		}),
		Cssnano,
		Autoprefixer,
	],
};

export { config as default };
