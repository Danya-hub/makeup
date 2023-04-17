import html from "./html/en.js";
import procedures from "./procedures/en.js";
import errors from "./errors/en.js";

const en = {
	translation: {
		...html,
		...errors,
		...procedures,
	},
};

export default en;
