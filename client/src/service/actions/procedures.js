import Check from "@/helpers/check.js";

function addNewProcedure(state, action) {
	state.cards.push(action.payload);
}

function putNewValue(state, action) {
	const [name, value] = action.payload;
	const _isObj = Check.isObject(value);

	state[name] = value;

	if (_isObj) {
		state[name] = {
			...state[name],
			...value,
		};
	}
}

export { addNewProcedure, putNewValue };
