import {
	createSlice,
} from "@reduxjs/toolkit";

import {
	actions as reducers,
	asyncActions,
	extraReducers,
} from "@/service/actions/allProcedures.js";

const initialState = {
	cards: [],
	isLoading: true,
	states: [],
	country: "ua",
	error: "",
};

const {
	actions,
	reducer,
} = createSlice({
	name: "allProcedures",
	initialState,
	reducers,
	extraReducers,
});

export {
	asyncActions,
	actions,
};
export default reducer;