function setUser(state, action) {
	state.user = action.payload.data;
}

function clearError(state) {
	state.error = "";
}

export { setUser, clearError };
