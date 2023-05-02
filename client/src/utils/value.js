import Check from "@/utils/check.js";

const valueActions = {
	changeObject(props, callback) {
		callback((prev) => ({
			...prev,
			...props,
		}));
	},

	changeArrayObjectByIndex(props, callback, index, prevBranch) {
		callback((prev) => {
			const array = prevBranch ? prevBranch(prev[index]) : prev[index];

			const rez = {
				...array,
				...props,
			};

			callback([...prev, rez]);
		});
	},

	changeArray(value, callback) {
		callback((prev) => [...prev, value]);
	},

	fromInput(e, callback) {
		const t = e.currentTarget;

		this.changeObject(
			{
				[t.name]: t.value,
			},
			callback,
		);
	},

	toDate(object) {
		const rez = {
			...object,
		};
		const keys = Object.keys(rez);

		keys.forEach((key) => {
			const date = Check.isDate(rez[key]);

			if (date) {
				rez[key] = date;
			}
		});

		return rez;
	},

	charWidthInPixels(text) {
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");

		const { font } = window.getComputedStyle(document.body);
		ctx.font = font;

		return ctx.measureText(text).width;
	},
};

export default valueActions;
