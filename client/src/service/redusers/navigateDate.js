import { createSlice } from "@reduxjs/toolkit";

import reducers from "@/service/actions/navigateDate.js";

const initialState = {
	date: new Date(),
	isCurrentDate: true,
};

const { actions, reducer } = createSlice({
	name: "navigateDate",
	reducers,
	initialState,
});

export { actions };
export default reducer;
