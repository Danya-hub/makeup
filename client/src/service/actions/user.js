/* eslint-disable no-param-reassign */

import {
	createAsyncThunk,
} from "@reduxjs/toolkit";

import Value from "@/utils/value.js";
import axios from "@/http/axios.js";
import format from "@/components/UI/Form/ChannelInput/constants/format.js";

export const actions = {
	setUser(state, action) {
		state.info = Value.toDate(action.payload);
		state.info.fullTel = format.telephone[state.info.country].code + state.info.telephone;
	},

	clearError(state) {
		state.error = "";
	},
};

export const asyncActions = {
	refresh: createAsyncThunk(
		"user/refresh",
		async (_, {
			rejectWithValue,
		}) => {
			try {
				const user = await axios.indGet("/auth/refresh");

				localStorage.setItem("token", user.data.accessToken);

				return user.data;
			} catch (error) {
				return rejectWithValue(error.response.data);
			}
		},
	),

	signup: createAsyncThunk(
		"user/signup",
		async (value, {
			rejectWithValue,
		}) => {
			try {
				const createdUser = await axios.post("/auth/signup", value);

				localStorage.setItem("token", createdUser.data.accessToken);

				return createdUser.data;
			} catch (error) {
				return rejectWithValue(error.response.data);
			}
		},
	),

	signin: createAsyncThunk(
		"user/signin",
		async (value, {
			rejectWithValue,
		}) => {
			try {
				const foundUser = await axios.post("/auth/signin", value);

				localStorage.setItem("token", foundUser.data.accessToken);

				return foundUser.data;
			} catch (error) {
				return rejectWithValue(error.response.data);
			}
		},
	),

	logout: createAsyncThunk("user/logout", async (_, {
		rejectWithValue,
	}) => {
		try {
			const requestState = await axios.post("/auth/logout");

			localStorage.removeItem("token");

			return requestState;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}),

	sendLinkForResetingPassword: createAsyncThunk(
		"user/sendLinkForResetingPassword",
		async (value, {
			rejectWithValue,
		}) => {
			try {
				const requestState = await axios.indPost("/auth/sendLinkForResetingPassword", value);

				return requestState;
			} catch (error) {
				return rejectWithValue(error.response.data);
			}
		},
	),

	resetPassword: createAsyncThunk(
		"user/resetPassword",
		async (value, {
			rejectWithValue,
		}) => {
			try {
				const requestState = await axios.indPost(`/auth/resetPassword`, value);

				return requestState;
			} catch (error) {
				return rejectWithValue(error.response.data);
			}
		},
	),

	editUserById: createAsyncThunk(
		"user/editUserById",
		async (value, {
			rejectWithValue,
		}) => {
			try {
				await axios.indPost("/auth/editUserById", value);

				return value.data;
			} catch (error) {
				return rejectWithValue(error.response.data);
			}
		},
	),
};

export const extraReducers = {
	[asyncActions.signin.fulfilled]: (state, action) => {
		state.error = "";

		actions.setUser(state, action);
	},
	[asyncActions.signin.rejected]: (state, action) => {
		const object = action.payload?.error;

		state.error = object;
	},
	[asyncActions.sendLinkForResetingPassword.fulfilled]: (state) => {
		state.error = "";
	},
	[asyncActions.sendLinkForResetingPassword.rejected]: (state, action) => {
		state.error = action.payload?.error[0]?.msg;
	},
	[asyncActions.resetPassword.fulfilled]: (state) => {
		state.error = "";
	},
	[asyncActions.resetPassword.rejected]: (state, action) => {
		state.error = action.payload?.error;
	},
	[asyncActions.resetPassword.pending]: (state) => {
		state.error = "";
	},
	[asyncActions.refresh.fulfilled]: (state, action) => {
		actions.setUser(state, action);
	},
	[asyncActions.signup.fulfilled]: (state, action) => {
		actions.setUser(state, action);
	},
	[asyncActions.refresh.rejected]: () => {
		localStorage.removeItem("token");
	},
	[asyncActions.logout.fulfilled]: (state, action) => {
		action.payload = null;

		actions.setUser(state, action);
	},
	[asyncActions.editUserById.fulfilled]: (state, action) => {
		actions.setUser(state, {
			payload: {
				...state.info,
				...action.payload,
			},
		});
	},
};