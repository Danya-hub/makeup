import Type from "@/helpers/checkType.js";

function addNewProcedure(state, action) {
	state.carts.push(action.payload);
}

function putNewValue(state, action) {
	const [name, value] = action.payload;
	const _isObj = Type.isObject(value);

	state[name] = value;

	if (_isObj) {
		state[name] = {
			...state[name],
			...value,
		};
	}
}

export { addNewProcedure, putNewValue };
