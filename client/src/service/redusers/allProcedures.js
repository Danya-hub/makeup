import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "@/http/axios.js";
import * as reducers from "@/service/actions/allProcedures.js";
import parseValueToDate from "@/utils/parseValueToDate.js";
import FormatDate from "@/utils/formatDate.js";

const initialState = {
	carts: [],
	newProcedure: {},
	isLoading: {
		procedure: false,
	},
	states: [],
	types: [],
	error: "",
};

const getProcedureByDay = createAsyncThunk(
	"procedure/getProcedureByDay",
	async (date, { dispatch, rejectWithValue }) => {
		try {
			const userProcedures = await axios
				.get(`/procedure/byDay/${date}`)
				.then((res) => res.data.map(parseValueToDate));

			dispatch(actions.putNewValue(["carts", userProcedures]));
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

const getAllStates = createAsyncThunk(
	"procedure/getAllStates",
	async (_, { dispatch, rejectWithValue }) => {
		try {
			const states = await axios.get("/procedure/allStates");

			dispatch(actions.putNewValue(["states", states.data]));
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

const getAllTypes = createAsyncThunk(
	"procedure/getAllTypes",
	async (_, { dispatch, rejectWithValue }) => {
		try {
			const states = await axios.get("/procedure/allTypes");

			dispatch(actions.putNewValue(["types", states.data]));
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

const getDefaultProcValue = createAsyncThunk(
	"procedure/getDefaultProcValue",
	async (_, { dispatch, rejectWithValue }) => {
		try {
			const defaultValue = await axios.get("/procedure/defaultValue").then((res) => ({
				...res.data,
				startProcTime: new Date(),
				finishProcTime: FormatDate.minutesInDate(res.data.type.durationProc * 60),
			}));

			dispatch(actions.putNewValue(["newProcedure", defaultValue]));

			return defaultValue;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

const createNewProcedure = createAsyncThunk(
	"procedure/createNewProcedure",
	async (value, { rejectWithValue }) => {
		try {
			const createdProcedure = await axios.post("/procedure/create", value);

			return createdProcedure;
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
		[getProcedureByDay.pending]: (state) => {
			state.isLoading.procedure = true;
		},
		[getProcedureByDay.fulfilled]: (state) => {
			state.isLoading.procedure = false;
		},
		[getProcedureByDay.rejected]: (state, action) => {
			state.isLoading.procedure = false;
			state.error = action.payload;
		},
		[createNewProcedure.rejected]: (state, action) => {
			state.error = action.payload;
		},
	},
});

export {
	reducer as default,
	getProcedureByDay,
	getAllStates,
	getAllTypes,
	getDefaultProcValue,
	createNewProcedure,
	actions,
};
