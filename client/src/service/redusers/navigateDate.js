import { createSlice } from "@reduxjs/toolkit";

import * as reducers from "@/service/actions/navigateDate.js";

const initialState = {
	date: new Date(),
	isCurrentDate: true,
};

const { actions, reducer } = createSlice({
	name: "navigateDate",
	reducers,
	initialState,
});

export { reducer as default, actions };
