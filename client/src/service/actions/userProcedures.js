/* eslint-disable no-param-reassign */

import {
	createAsyncThunk,
} from "@reduxjs/toolkit";

import axios from "@/http/axios.js";
import Value from "@/utils/value.js";

export const actions = {};

export const asyncActions = {
	getFavorites: createAsyncThunk("procedure/getFavorites", async (id, {
		rejectWithValue,
	}) => {
		try {
			const result = await axios
				.get(`/procedure/favorite = 1 AND user = ${id}`)
				.then((res) => res.data.map(Value.toDate));

			return result;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}),

	getProceduresByUserId: createAsyncThunk(
		"procedure/getProceduresByUserId",
		async (id, {
			rejectWithValue,
		}) => {
			try {
				const appointments = await axios
					.get(`/procedure/user = ${id} AND available = 1`)
					.then((res) => res.data.map(Value.toDate));

				return appointments;
			} catch (error) {
				return rejectWithValue(error.message);
			}
		},
	),
};

export const extraReducers = {
	[asyncActions.getFavorites.fulfilled]: (state, action) => {
		state.favoriteProcedurs = action.payload;
	},
	[asyncActions.getFavorites.pending]: (state) => {
		state.favoriteProcedurs = [];
	},
	[asyncActions.getProceduresByUserId.payload]: (state) => {
		state.proceduresByUser = [];
	},
	[asyncActions.getProceduresByUserId.fulfilled]: (state, action) => {
		state.proceduresByUser = action.payload;
	},
};