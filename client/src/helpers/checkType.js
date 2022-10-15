function isObject(value) {
	return typeof value === "object" && !Array.isArray(value);
}

function checkValueOnDate(value) {
	const date = new Date(value);

	return isObject(date) && !isNaN(date.getTime()) && typeof value === "string" ? date : null;
}

export { isObject, checkValueOnDate };
