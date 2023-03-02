import Check from "@/helpers/check.js";

const actions = {
	putNewValue(state, action) {
		const [name, value] = action.payload;
		const isObject = Check.isObject(value);
		const objState = state;

		objState[name] = value;

		if (isObject) {
			objState[name] = {
				...objState[name],
				...value,
			};
		}
	},
};

export default actions;
