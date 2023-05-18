const global = {
	getWidthByChar(text) {
		return (text.length + 1) * 6.5;
	},

	nextNumber(number, array) {
		return array.sort((x, y) => Math.abs(number - x) - Math.abs(number - y))[0];
	},
};

export default global;
