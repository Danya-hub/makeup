class Check {
	isObject(value) {
		return typeof value === "object" && !Array.isArray(value);
	}

	isDate(value) {
		const date = new Date(value);

		return this.isObject(date) && !isNaN(date.getTime()) && typeof value === "string" ? date : null;
	}

	isFloat(value) {
		return /^(-|\+)?\d*(\.\d+)?$/.test(value);
	}

	isNumber(value) {
		return /^(-|\+)?\d*$/.test(value);
	}

	onEmpty(val) {
		for (const _ in val) {
			return false;
		}

		return true;
	}
}

export default new Check();
