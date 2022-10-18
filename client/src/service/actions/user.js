function setUser(state, action) {
	state.info = action.payload;
}

function clearError(state) {
	state.error = "";
}

export { setUser, clearError };
