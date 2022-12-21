import {
	createSlice,
	createAsyncThunk
} from "@reduxjs/toolkit";

import axios from "@/http/axios.js";
import * as reducers from "@/service/actions/allProcedures.js";
import FormatDate from "@/utils/formatDate.js";

const initialState = {
	carts: [],
	newProcedure: {},
	isLoading: {
		procedures: true,
	},
	states: [],
	types: [],
	error: "",
};

const getProcedureByDay = createAsyncThunk(
	"procedure/getProcedureByDay",
	async (date, {
		rejectWithValue
	}) => {
		try {
			const userProcedures = await axios
				.indGet(`/procedure/byDay/${date}`)
				.then((res) => res.data.map(Date.toDate));

			return userProcedures;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

const getAllStates = createAsyncThunk("procedure/getAllStates",
	async (_, {
		rejectWithValue
	}) => {
		try {
			const states = await axios.indGet("/procedure/allStates");

			return states;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	});

const getAllTypes = createAsyncThunk("procedure/getAllTypes", async (_, {
	rejectWithValue
}) => {
	try {
		const types = await axios.indGet("/procedure/allTypes");

		return types;
	} catch (error) {
		return rejectWithValue(error.message);
	}
});

const getDefaultProcValue = createAsyncThunk(
	"procedure/getDefaultProcValue",
	async (_, {
		rejectWithValue
	}) => {
		try {
			const defaultValue = await axios.indGet("/procedure/defaultValue").then((res) => ({
				...res.data,
				startProcTime: new Date(),
				finishProcTime: FormatDate.minutesInDate(res.data.type.durationProc * 60),
			}));

			return defaultValue;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

const createNewProcedure = createAsyncThunk(
	"procedure/createNewProcedure",
	async (value, {
		rejectWithValue
	}) => {
		try {
			const createdProcedure = await axios.post("/procedure/create", value);

			return createdProcedure;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

const {
	actions,
	reducer
} = createSlice({
	name: "procedure",
	initialState,
	reducers,
	extraReducers: {
		[getProcedureByDay.pending]: (state) => {
			state.isLoading.procedures = true;
		},
		[getProcedureByDay.fulfilled]: (state, action) => {
			state.isLoading.procedures = false;
			state.carts = action.payload;
		},
		[getProcedureByDay.rejected]: (state, action) => {
			state.isLoading.procedures = false;
			state.error = action.payload;
		},
		[createNewProcedure.rejected]: (state, action) => {
			state.error = action.payload;
		},
		[getAllStates.fulfilled]: (state, action) => {
			state.states = action.payload.data;
		},
		[getAllTypes.fulfilled]: (state, action) => {
			state.types = action.payload.data;
		},
		[getDefaultProcValue.fulfilled]: (state, action) => {
			state.newProcedure = action.payload;
		},
	},
});

export {
	reducer as
	default,
	getProcedureByDay,
	getAllStates,
	getAllTypes,
	getDefaultProcValue,
	createNewProcedure,
	actions,
};