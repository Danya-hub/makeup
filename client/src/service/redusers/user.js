import {
	createSlice,
} from "@reduxjs/toolkit";

import {
	actions as reducers,
	extraReducers,
	asyncActions,
} from "@/service/actions/user.js";

const initialState = {
	info: null,
	error: null,
};

const {
	actions,
	reducer,
} = createSlice({
	name: "user",
	initialState,
	reducers,
	extraReducers,
});

export {
	asyncActions,
	actions,
};
export default reducer;