const actions = {
	setUser(state, action) {
		const objState = state;

		objState.info = action.payload;
	},

	clearError(state) {
		const objState = state;

		objState.error = "";
	},
};

export default actions;
