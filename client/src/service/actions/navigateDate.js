const actions = {
	setNavigateDate(state, action) {
		const [date, isCurrentDate] = action.payload;
		const objState = state;

		objState.date = date.getTime();
		objState.isCurrentDate = Boolean(isCurrentDate);
	},
};

export default actions;
