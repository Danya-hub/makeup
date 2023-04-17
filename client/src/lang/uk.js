import html from "./html/uk.js";
import errors from "./errors/uk.js";
import procedures from "./procedures/uk.js";

const uk = {
	translation: {
		...html,
		...errors,
		...procedures,
	},
};

export default uk;