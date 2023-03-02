import Check from "@/helpers/check.js";

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
		const o = object;
		const keys = Object.keys(o);

		keys.forEach((key) => {
			const date = Check.isDate(o[key]);

			if (date) {
				o[key] = date;
			}
		});

		return o;
	},
};

export default valueActions;
