/* eslint-disable no-param-reassign */

import {
	createAsyncThunk,
} from "@reduxjs/toolkit";

import axios from "@/http/axios.js";
import DataFormatter from "@/utils/dataFormatter.js";

export const actions = {};

export const asyncActions = {
	getFavorites: createAsyncThunk("procedure/getFavorites", async (id, {
		rejectWithValue,
	}) => {
		try {
			const result = await axios
				.get(`/procedure/columns/favorite = 1 AND user = ${id}`)
				.then((res) => res.data.map(DataFormatter.toDate));

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
					.get(`/procedure/columns/user = ${id} AND available = 1`)
					.then((res) => res.data.map(DataFormatter.toDate));

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