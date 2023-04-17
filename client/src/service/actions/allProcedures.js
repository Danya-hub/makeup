/* eslint-disable no-param-reassign */

import {
	createAsyncThunk,
} from "@reduxjs/toolkit";

import Check from "@/helpers/check.js";
import Value from "@/helpers/value.js";

import axios from "@/http/axios.js";

export const actions = {
	putNewValue(state, action) {
		const [name, value] = action.payload;
		const isObject = Check.isObject(value);
		const objState = state;

		objState[name] = value;

		if (isObject) {
			objState[name] = {
				...objState[name],
				...value,
			};
		}
	},
};

export const asyncActions = {
	getProcedureByUserId: createAsyncThunk(
		"procedure/getProcedureByUserId",
		async (_, {
			rejectWithValue,
		}) => {
			try {
				const userProcedures = await axios
					.get("/procedure/byUser")
					.then((res) => res.data.map(Value.toDate));

				return userProcedures;
			} catch (error) {
				return rejectWithValue(error.message);
			}
		},
	),

	getProcedureByDay: createAsyncThunk(
		"procedure/getProcedureByDay",
		async (date, {
			rejectWithValue,
		}) => {
			try {
				const userProcedures = await axios
					.indGet(`/procedure/byDay/${date}`)
					.then((res) => res.data.map(Value.toDate));

				return userProcedures;
			} catch (error) {
				return rejectWithValue(error.message);
			}
		},
	),
};

export const extraReducers = {
	[asyncActions.getProcedureByDay.pending]: (state) => {
		state.isLoading = true;
		state.cards = [];
	},
	[asyncActions.getProcedureByDay.fulfilled]: (state, action) => {
		state.isLoading = false;
		state.cards = action.payload;
	},
	[asyncActions.getProcedureByDay.rejected]: (state, action) => {
		state.isLoading = false;
		state.error = action.payload;
	},
	[asyncActions.getProcedureByUserId.payload]: (state) => {
		state.isLoading = true;
		state.cards = [];
	},
	[asyncActions.getProcedureByUserId.fulfilled]: (state, action) => {
		state.isLoading = false;
		state.cards = action.payload.data;
	},
	[asyncActions.getProcedureByUserId.rejected]: (state, action) => {
		state.isLoading = false;
		state.cards = action.error;
	},
};