import { checkValueOnDate } from "@/helpers/checkType.js";

function parseValueToDate(obj) {
	for (const key in obj) {
		const date = checkValueOnDate(obj[key]);

		if (date) {
			obj[key] = date;
		}
	}

	return obj;
}

export { parseValueToDate as default };
