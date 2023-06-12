import {
	createSlice,
} from "@reduxjs/toolkit";

import {
	actions as reducers,
	asyncActions,
	extraReducers,
} from "@/service/actions/userProcedures.js";

const initialState = {
	favoriteProcedurs: [],
	proceduresByUser: [],
};

const {
	actions,
	reducer,
} = createSlice({
	name: "userProcedures",
	initialState,
	extraReducers,
	reducers,
});

export {
	asyncActions,
	actions,
};
export default reducer;