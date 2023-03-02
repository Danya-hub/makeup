/* eslint-disable no-param-reassign */

import {
	createSlice,
	createAsyncThunk,
} from "@reduxjs/toolkit";

import axios from "@/http/axios.js";
import Value from "@/helpers/value.js";

import reducers from "@/service/actions/procedures.js";
import FormatDate from "@/utils/formatDate.js";

const initialState = {
	cards: [],
	isLoading: true,
	states: [],
	types: [],
	error: "",
};

const defaultValue = ({
	type,
	state,
}) => ({
	startProcTime: new Date(),
	finishProcTime: FormatDate.minutesToDate(type.durationProc * 60),
	state,
	type,
});

const getProcedureByUserId = createAsyncThunk(
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
);

const getProcedureByDay = createAsyncThunk(
	"procedure/getProcedureByDay",
	async (date, {
		rejectWithValue,
	}) => {
		try {
			const userProcedures = await axios
				.indGet(`/procedure/byDay/${date}`)
				.then((res) => res.data.map(Date.toDate));

			return userProcedures;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	},
);

const getAllTypes = createAsyncThunk("procedure/getAllTypes", async (_, {
	rejectWithValue,
}) => {
	try {
		const types = await axios.indGet("/procedure/allTypes");

		return types;
	} catch (error) {
		return rejectWithValue(error.message);
	}
});

const getAllStates = createAsyncThunk("procedure/getAllStates", async (_, {
	rejectWithValue,
}) => {
	try {
		const states = await axios.indGet("/procedure/allStates");

		return states;
	} catch (error) {
		return rejectWithValue(error.message);
	}
});

const getDefaultProcValue = createAsyncThunk(
	"procedure/getDefaultProcValue",
	async (_, {
		rejectWithValue,
	}) => {
		try {
			const res = await axios.indGet("/procedure/defaultType")
				.then((r) => r.data);
			const defValue = defaultValue(res);

			return defValue;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	},
);

const createNewProcedure = createAsyncThunk(
	"procedure/createNewProcedure",
	async (value, {
		rejectWithValue,
	}) => {
		try {
			const createdProcedure = await axios
				.post("/procedure/create", value)
				.then((res) => Value.toDate(res.data));
			return createdProcedure;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	},
);

const {
	actions,
	reducer,
} = createSlice({
	name: "procedure",
	initialState,
	reducers,
	extraReducers: {
		[getProcedureByDay.pending]: (state) => {
			state.isLoading = true;
			state.cards = [];
		},
		[getProcedureByDay.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.cards = action.payload;
		},
		[getProcedureByDay.rejected]: (state, action) => {
			state.isLoading = false;
			state.error = action.payload;
		},
		[createNewProcedure.pending]: (state) => {
			state.isLoading = true;
		},
		[createNewProcedure.fulfilled]: (state) => {
			state.isLoading = false;
		},
		[createNewProcedure.rejected]: (state, action) => {
			state.error = action.payload;
			state.isLoading = false;
		},
		[getAllTypes.fulfilled]: (state, action) => {
			state.types = action.payload.data;
		},
		[getAllStates.fulfilled]: (state, action) => {
			state.states = action.payload.data;
		},
		[getProcedureByUserId.payload]: (state) => {
			state.isLoading = true;
			state.cards = [];
		},
		[getProcedureByUserId.fulfilled]: (state, action) => {
			state.isLoading = false;
			state.cards = action.payload.data;
		},
		[getProcedureByUserId.rejected]: (state, action) => {
			state.isLoading = false;
			state.cards = action.error;
		},
	},
});

export {
	getProcedureByUserId,
	getProcedureByDay,
	getAllTypes,
	getAllStates,
	getDefaultProcValue,
	createNewProcedure,
	actions,
};
export default reducer;
