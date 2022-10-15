function setNavigateDate(state, action) {
	const [date, isCurrentDate] = action.payload;

	state.date = date.getTime();
	state.isCurrentDate = Boolean(isCurrentDate);
}

export { setNavigateDate };
