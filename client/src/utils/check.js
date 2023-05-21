const checkActions = {
	isObject(value) {
		return typeof value === "object" && !Array.isArray(value);
	},

	isDate(value) {
		const date = new Date(value);

		return this.isObject(date) && !Number.isNaN(date.getTime()) && typeof value === "string" ? date : null;
	},

	isFloat(value) {
		return /^(-|\+)?\d*(\.\d+)?$/.test(value);
	},

	isNumber(value) {
		return /^(-|\+)?\d*$/.test(value);
	},

	isStrictNumber(value) {
		return /^\d+$/.test(value);
	},

	isEmptyObject(object) {
		return Object.keys(object).length === 0;
	},
};

export default checkActions;
