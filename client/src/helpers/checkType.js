class Type {
	isObject(value) {
		return typeof value === "object" && !Array.isArray(value);
	}

	isDate(value) {
		const date = new Date(value);

		return this.isObject(date) && !isNaN(date.getTime()) && typeof value === "string" ? date : null;
	}

	isNumber(value) {
		return /^(-|\+)?\d*(\.\d+)?$/.test(value);
	}
}

export default new Type();