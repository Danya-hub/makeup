import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import * as reducers from "@/service/actions/userProcedures.js";
import axios from "@/http/axios.js";

const initialState = {
	carts: [],
	isLoading: false,
};

const getProcedureByUserId = createAsyncThunk(
	"procedure/getProcedureByUserId",
	async (id, { dispatch, rejectWithValue }) => {
		try {
			const userProcedures = await axios.get(`/procedure/byUser/${id}`);

			dispatch(actions.setProcedures(userProcedures));
			return userProcedures;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

const { actions, reducer } = createSlice({
	name: "procedure",
	initialState,
	reducers,
	extraReducers: {
		[getProcedureByUserId.pending]: (state) => {
			state.isLoading = true;
		},
		[getProcedureByUserId.fulfilled]: (state) => {
			state.isLoading = false;
		},
		[getProcedureByUserId.rejected]: (state) => {
			state.isLoading = false;
		},
	},
});

export { reducer as default, getProcedureByUserId, actions };
