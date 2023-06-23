/* eslint-disable no-param-reassign */

import {
	createAsyncThunk,
} from "@reduxjs/toolkit";

import UserProceduresHelper from "@/service/helpers/appointments.js";
import ProcConfig from "@/config/procedures.js";
import FormatDate from "@/utils/formatDate.js";
import Value from "@/utils/value.js";
import axios from "@/http/axios.js";
import GlobalHelper from "@/utils/global.js";

export const actions = {
	addProc(state) {
		const [currentProcedure] = state.currentProcedure;
		const newProc = UserProceduresHelper.getRangeProcTime(state, currentProcedure);

		state.newProcedures = [
			...state.newProcedures,
			[newProc, false, state.newProcedures.length],
		];
		state.lastItemAfterAction = state.newProcedures.length - 1;
		state.currentProcedure = [state.defaultProcedure, state.newProcedures.length];

		UserProceduresHelper.setProceduresByDay(state);
		UserProceduresHelper.resultConversion(state, true);
	},

	switchCurrentProc(state, action) {
		const index = action.payload;
		const [currentProcedure] = state.newProcedures[index];

		for (let i = 0; i < state.newProcedures.length; i += 1) {
			state.newProcedures[i][1] = index === i;
		}

		state.currentProcedure = [currentProcedure, index];

		UserProceduresHelper.setProceduresByDay(state);
		UserProceduresHelper.resultConversion(state);
	},

	deleteProc(state, action) {
		const index = action.payload;

		state.currentProcedure = [state.defaultProcedure, state.newProcedures.length - 1];
		state.newProcedures = state.newProcedures.filter((_, i) => i !== index);

		UserProceduresHelper.setProceduresByDay(state);
		UserProceduresHelper.resultConversion(state);
	},

	switchMonth(state, action) {
		const date = new Date(state.locale.getTime());
		const month = action.payload;

		UserProceduresHelper.setMonth(state, date, month);
		const newDate = UserProceduresHelper.setDirection(state, date);

		UserProceduresHelper.setViewDate(newDate, state);
	},

	switchDay(state, action) {
		const value = action.payload;

		UserProceduresHelper.setDay(state, value);
	},

	changeHour(state, action) {
		const [currentProcedure] = state.currentProcedure;

		currentProcedure.hour = GlobalHelper.nextNumber(
			action.payload + ProcConfig.START_WORK_TIME,
			state.availableHoursTime,
		);
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

		if (state.newProcedures[index]) {
			if (procedure) {
				const newProc = UserProceduresHelper.getRangeProcTime(state, procedure);

				state.newProcedures[index] = [newProc, blnState, index];
			} else {
				state.newProcedures[index][1] = blnState;
			}
		}

		UserProceduresHelper.resultConversion(state, true);
	},

	updateAvailableTimeByDate(state, action) {
		UserProceduresHelper.resultConversion(state, action.payload);
	},
};

export const asyncActions = {
	getProcedureById: createAsyncThunk(
		"appointment/getProcedureById",
		async (id, {
			rejectWithValue,
		}) => {
			try {
				const appointments = await axios
					.get(`/procedure/columns/id = ${id}`)
					.then((res) => Value.toDate(res.data[0]));

				return appointments;
			} catch (error) {
				return rejectWithValue(error.message);
			}
		},
	),

	getReviewsByQuery: createAsyncThunk(
		"appointment/getReviewsByQuery",
		async (query, {
			rejectWithValue,
		}) => {
			try {
				const appointments = await axios
					.get(`/procedure/reviews?${query}`)
					.then((res) => res.data.map(Value.toDate));

				return appointments;
			} catch (error) {
				return rejectWithValue(error.message);
			}
		},
	),

	makeReview: createAsyncThunk(
		"appointment/getReviewsByQuery",
		async (value, {
			rejectWithValue,
		}) => {
			try {
				const newReview = await axios
					.post("/procedure/makeReview", {
						...value,
						createdAt: new Date(),
					});

				return newReview;
			} catch (error) {
				return rejectWithValue(error.response);
			}
		},
	),

	getProcedureByDay: createAsyncThunk(
		"appointment/getProcedureByDay",
		async (date, {
			rejectWithValue,
		}) => {
			try {
				const appointments = await axios
					.indGet(`/procedure/byDay/${date}`)
					.then((res) => res.data.map(Value.toDate));

				return appointments;
			} catch (error) {
				return rejectWithValue(error.message);
			}
		},
	),

	createNewProcedures: createAsyncThunk(
		"appointment/createNewProcedure",
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

					if (object.contract) {
						const result = {};
						const [file, values] = object.contract;

						Object.keys(values).forEach((key) => {
							result[key] = values[key](object);
						});

						object.contract = [file, result];
					}

					return object;
				});

				await axios.post("/procedure/createProcedure", newProcedures);

				return newProcedures;
			} catch (error) {
				return rejectWithValue(error.message);
			}
		},
	),

	getDefaultProcValue: createAsyncThunk(
		"appointment/getDefaultProcValue",
		async (addition, {
			getState,
			rejectWithValue,
		}) => {
			try {
				const states = getState();
				const defaultValue = await axios.indGet(`/procedure/default/${states.appointments.country}`)
					.then((r) => r.data);

				const object = {
					startProcTime: new Date(),
					finishProcTime: FormatDate.minutesToDate(
						defaultValue.type.duration * states.appointments.hourHeightInPx,
						null,
						true,
					),
					...defaultValue,
					...addition,
				};

				return object;
			} catch (error) {
				return rejectWithValue(error.message);
			}
		},
	),

	getAllTypes: createAsyncThunk("appointment/getAllTypes", async (_, {
		getState,
		rejectWithValue,
	}) => {
		try {
			const states = getState();
			const types = await axios.indGet(`/procedure/allTypes/${states.appointments.country}`);

			return types;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}),

	deleteProc: createAsyncThunk("appointment/deleteProcedureById", async (value, {
		rejectWithValue,
	}) => {
		try {
			const result = await axios.post(`/procedure/deleteProcedureById/${value}`);

			return result;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}),

	deleteReview: createAsyncThunk("appointment/deleteReview", async (value, {
		rejectWithValue,
	}) => {
		try {
			const result = await axios.post(`/procedure/deleteReview/${value}`);

			return result;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}),

	updateReview: createAsyncThunk("appointment/updateReview", async (value, {
		rejectWithValue,
	}) => {
		try {
			const result = await axios.post("/procedure/updateReview", value);

			return result;
		} catch (error) {
			return rejectWithValue(error.response);
		}
	}),

	updateProc: createAsyncThunk("appointment/updateProcedure", async (value, {
		rejectWithValue,
		getState,
	}) => {
		try {
			const [newProcedure, updateTime] = value;
			const state = getState();

			let body = newProcedure;

			if (updateTime) {
				body = UserProceduresHelper.getRangeProcTime(
					state.appointments,
					body,
				);
			}

			const result = await axios.post("/procedure/updateProcedure", body);

			return result;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}),
};

export const extraReducers = {
	[asyncActions.getDefaultProcValue.fulfilled]: (state, action) => {
		const value = action.payload;

		state.defaultProcedure = {
			...state.defaultProcedure,
			...value,
			contract: null,
		};
		state.currentProcedure = [state.defaultProcedure, 0];
	},
	[asyncActions.getAllTypes.fulfilled]: (state, action) => {
		state.types = action.payload.data;
	},
	[asyncActions.getProcedureByDay.pending]: (state) => {
		state.addedUserProcedures = [];
	},
	[asyncActions.getProcedureByDay.fulfilled]: (state, action) => {
		state.addedUserProcedures = action.payload;

		UserProceduresHelper.setProceduresByDay(state);
		UserProceduresHelper.resultConversion(state);
	},
};