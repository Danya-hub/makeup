import Type from "@/helpers/checkType.js";

Array.prototype.sortWithCallback = function (callback) {
	return this.length ? Array(...this).sort(callback) : this;
};

Date.toDate = function (obj) {
	for (const key in obj) {
		const date = Type.isDate(obj[key]);

		if (date) {
			obj[key] = date;
		}
	}

	return obj;
};

String.prototype.repeatByLimit = function (repeatSymb, limit) {
	return repeatSymb.repeat(limit - String(this).length) + this;
};

String.prototype.getWidthByChar = function () {
	return (this.length + 1) * 6.5;
};

Math.minObject = function (callback, values) {
	const minObj = values.reduce((prevObj, currObj) => {
		const prevVal = callback(prevObj),
			currVal = callback(currObj);

		return prevVal < currVal ? prevObj : currObj;
	});

	return minObj;
};

Math.maxObject = function (callback, values) {
	const maxObj = values.reduce((prevObj, currObj) => {
		const prevVal = callback(prevObj),
			currVal = callback(currObj);

		return prevVal > currVal ? prevObj : currObj;
	});

	return maxObj;
};