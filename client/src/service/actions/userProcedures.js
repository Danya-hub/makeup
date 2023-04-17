/* eslint-disable no-param-reassign */

import {
	createAsyncThunk,
} from "@reduxjs/toolkit";

import UserProceduresHelper from "@/service/helpers/userProcedures.js";
import ProcConfig from "@/config/procedures.js";
import FormatDate from "@/utils/formatDate.js";
import axios from "@/http/axios.js";

export const actions = {
	addProc(state) {
		const [currentProcedure] = state.currentProcedure;
		const newProc = UserProceduresHelper.getRangeProcTime(state, currentProcedure);

		state.newProcedures.push(
			[newProc, false, state.newProcedures.length],
		);
		state.lastItemAfterAction = state.newProcedures.length - 1;
		state.currentProcedure = [state.defaultProcedure, state.newProcedures.length];

		UserProceduresHelper.defaultAvailableTimeByDate(state, true);
	},

	switchCurrentProc(state, action) {
		const index = action.payload;
		const [currentProcedure] = state.newProcedures[index];

		for (let i = 0; i < state.newProcedures.length; i += 1) {
			state.newProcedures[i][1] = index === i;
		}

		state.currentProcedure = [currentProcedure, index];

		UserProceduresHelper.defaultAvailableTimeByDate(state);
	},

	deleteProc(state, action) {
		const index = action.payload;

		state.currentProcedure = [state.defaultProcedure, state.newProcedures.length - 1];
		state.newProcedures = state.newProcedures.filter((_, i) => i !== index);

		UserProceduresHelper.defaultAvailableTimeByDate(state);
	},

	switchMonth(state, action) {
		const date = new Date(state.locale.getTime());
		const month = action.payload;

		UserProceduresHelper.setMonth(state, date, month);
		const newDate = UserProceduresHelper.setDirection(state, date);

		UserProceduresHelper.setViewDate(newDate, state);
		UserProceduresHelper.defaultAvailableTimeByDate(state);
	},

	switchDay(state, action) {
		const value = action.payload;

		UserProceduresHelper.setDay(state, value);
	},

	changeHour(state, action) {
		const [currentProcedure] = state.currentProcedure;

		currentProcedure.hour = action.payload + ProcConfig.START_WORK_TIME;
	},

	updateCurrProc(state, action) {
		const [procedure, updateDay = true] = action.payload;
		state.currentProcedure = procedure;

		if (updateDay) {
			UserProceduresHelper.setDay(state, state.locale.getDate());
		}
	},

	setCurrProcValue(state, action) {
		const [key, value] = action.payload;
		const [currProcedure] = state.currentProcedure;

		currProcedure[key] = value;
	},

	updateProcStateByIndex(state, action) {
		const [index, blnState, procedure] = action.payload;

		state.lastItemAfterAction = index;

		if (procedure) {
			const newProc = UserProceduresHelper.getRangeProcTime(state, procedure);

			state.newProcedures[index] = [newProc, blnState, index];
		} else {
			state.newProcedures[index][1] = blnState;
		}

		UserProceduresHelper.defaultAvailableTimeByDate(state, true);
	},
};

export const asyncActions = {
	createNewProcedures: createAsyncThunk(
		"procedure/createNewProcedure",
		async (value, {
			rejectWithValue,
			getState,
		}) => {
			try {
				const state = getState();
				const newProcedures = value.map(([object]) => {
					object = {
						...object,
						user: state.user.info,
						createdAt: new Date(),
					};

					const result = {};
					const [file, values] = object.contract;

					Object.keys(values).forEach((key) => {
						result[key] = values[key](object);
					});

					return {
						...object,
						contract: [file, result],
					};
				});

				await axios.post("/procedure/createProcedure", newProcedures);

				return newProcedures;
			} catch (error) {
				return rejectWithValue(error.message);
			}
		},
	),

	getDefaultProcValue: createAsyncThunk(
		"procedure/getDefaultProcValue",
		async (_, {
			getState,
			rejectWithValue,
		}) => {
			try {
				const states = getState();
				const defaultValue = await axios.indGet(`/procedure/default/${states.allProcedures.country}`)
					.then((r) => r.data);

				const object = {
					state: "pending",
					startProcTime: new Date(),
					finishProcTime: FormatDate.minutesToDate(
						defaultValue.type.duration * states.userProcedures.hourHeightInPx,
						null,
						true,
					),
					...defaultValue,
				};

				return object;
			} catch (error) {
				return rejectWithValue(error.message);
			}
		},
	),

	getAllTypes: createAsyncThunk("procedure/getAllTypes", async (_, {
		getState,
		rejectWithValue,
	}) => {
		try {
			const states = getState();
			const types = await axios.indGet(`/procedure/allTypes/${states.allProcedures.country}`);

			return types;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}),
};

export const extraReducers = {
	[asyncActions.getDefaultProcValue.pending]: (state) => {
		state.isLoading = true;
	},
	[asyncActions.getDefaultProcValue.fulfilled]: (state, action) => {
		const value = action.payload;

		state.defaultProcedure = {
			...state.defaultProcedure,
			...value,
		};
		state.currentProcedure = [state.defaultProcedure, 0];

		UserProceduresHelper.defaultAvailableTimeByDate(state);

		state.isLoading = false;
	},
	[asyncActions.createNewProcedures.pending]: (state) => {
		state.isLoading = true;
	},
	[asyncActions.createNewProcedures.fulfilled]: (state) => {
		state.isLoading = false;
	},
	[asyncActions.createNewProcedures.rejected]: (state, action) => {
		state.error = action.payload;
		state.isLoading = false;
	},
	[asyncActions.getAllTypes.fulfilled]: (state, action) => {
		state.types = action.payload.data;
	},
};