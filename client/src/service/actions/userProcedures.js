/* eslint-disable no-param-reassign */

import {
	createAsyncThunk,
} from "@reduxjs/toolkit";

import helper from "@/service/helpers/userProcedures.js";
import ProcConfig from "@/config/procedures.js";
import FormatDate from "@/utils/formatDate.js";
import Check from "@/helpers/check.js";
import Value from "@/helpers/value.js";
import AllProceduresHelper from "@/service/helpers/allProcedures.js";
import axios from "@/http/axios.js";

export const actions = {
	switchCurrentProc(state, action) {
		const index = action.payload;
		const [currentProcedure] = state.newProcedures[index];

		state.currentProcedure = [currentProcedure, index];
		state.newProcedures[index] = [currentProcedure, true, index];
	},

	deleteProc(state, action) {
		const index = action.payload;

		state.currentProcedure = [state.defaultProcedure, state.newProcedures.length - 1];
		state.newProcedures.splice(index, 1);
	},

	switchMonth(state, action) {
		const date = new Date(state.locale.getTime());
		const month = action.payload;

		helper.setMonth(state, date, month);
		const newDate = helper.setDirection(state, date);

		helper.setDayRange(newDate, state);
	},

	switchDay(state, action) {
		const [currentProcedure] = state.currentProcedure;
		const value = action.payload;
		const isDay = Check.isStrictNumber(value);

		const {
			year,
			month,
			hour,
		} = currentProcedure;

		const date = isDay ? new Date(year, month, value, hour) : value;
		const newDate = helper.setDirection(state, date);

		helper.setDay(state, newDate);
		helper.setDayRange(newDate, state);
		helper.getDayRange(state);
	},

	changeHour(state, action) {
		const [currentProcedure] = state.currentProcedure;

		currentProcedure.hour = action.payload + ProcConfig.START_WORK_TIME;
	},

	updateCurrProc(state, action) {
		state.currentProcedure = action.payload;
	},

	setCurrProcValue(state, action) {
		const [key, value] = action.payload;
		const [currProcedure] = state.currentProcedure;

		currProcedure[key] = value;
	},

	addProc(state) {
		const [currentProcedure] = state.currentProcedure;
		const newProc = helper.getRangeProcTime(state, currentProcedure);

		state.newProcedures.push(
			[newProc, false, state.newProcedures.length],
		);
		state.availableTime = FormatDate.availableTimeByRange({
			initialState: {
				hours: 0,
				minutes: state.minDayTime * 60,
			},
			step: state.dragStep,
			minHour: ProcConfig.START_WORK_TIME,
			maxHour: ProcConfig.FINISH_WORK_TIME,
			skipCondition: (time) => AllProceduresHelper.isTouchCard(time, {
				newProcedures: state.newProcedures,
				currentProcedure: state.currentProcedure,
			}),
		});

		const time = FormatDate.minutesFromDate(state.availableTime[0], 1);

		state.defaultProcedure.hour = time;
		state.currentProcedure = [state.defaultProcedure, state.newProcedures.length + 1];
	},

	updateProcStateByIndex(state, action) {
		const [index, blnState, procedure] = action.payload;

		if (procedure) {
			const newProc = helper.getRangeProcTime(state, procedure);

			state.newProcedures[index] = [newProc, blnState, index];
		} else {
			state.newProcedures[index][1] = blnState;
		}
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
				const newProcedures = value.map(([object]) => ({
					...object,
					user: state.user.info,
				}));

				const createdProcedure = await axios
					.post("/procedure/createProcedure", newProcedures)
					.then((res) => Value.toDate(res.data));
				return createdProcedure;
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
				const type = await axios.indGet(`/procedure/defaultType/${states.allProcedures.country}`)
					.then((r) => r.data);
				const defValue = {
					startProcTime: new Date(),
					finishProcTime: FormatDate.minutesToDate(type.duration * 60),
					type,
				};

				return defValue;
			} catch (error) {
				return rejectWithValue(error.message);
			}
		},
	),
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
		state.availableTime = FormatDate.availableTimeByRange({
			initialState: {
				hours: 0,
				minutes: state.minDayTime * 60,
			},
			step: state.dragStep,
			minHour: ProcConfig.START_WORK_TIME,
			maxHour: ProcConfig.FINISH_WORK_TIME,
			skipCondition: (time) => AllProceduresHelper.isTouchCard(time, {
				newProcedures: state.newProcedures,
				currentProcedure: state.currentProcedure,
			}),
		});
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
};