import html from "./html/ru.js";
import errors from "./errors/ru.js";
import procedures from "./procedures/ru.js";

const ru = {
	translation: {
		...html,
		...errors,
		...procedures,
	},
};

export default ru;