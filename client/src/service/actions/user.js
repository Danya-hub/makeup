/* eslint-disable no-param-reassign */

import {
	createAsyncThunk,
} from "@reduxjs/toolkit";

import Value from "@/helpers/value.js";
import axios from "@/http/axios.js";

export const actions = {
	setUser(state, action) {
		state.info = Value.toDate(action.payload);
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

	sendPasswordForCompare: createAsyncThunk(
		"user/sendPasswordForCompare",
		async (value, {
			rejectWithValue,
		}) => {
			try {
				const {
					passwordToken,
				} = await axios
					.indPost("/auth/sendPasswordForCompare", value)
					.then((res) => res.data);

				return passwordToken;
			} catch (error) {
				return rejectWithValue(error.response.data);
			}
		},
	),

	comparePassword: createAsyncThunk(
		"user/comparePassword",
		async (value, {
			rejectWithValue,
		}) => {
			try {
				const user = await axios.indPost("/auth/comparePassword", value).then((res) => res.data);

				return user;
			} catch (error) {
				return rejectWithValue(error.response.data);
			}
		},
	),

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

};

export const extraReducers = {
	[asyncActions.sendPasswordForCompare.fulfilled]: (state) => {
		state.error = "";
	},
	[asyncActions.sendPasswordForCompare.rejected]: (state, action) => {
		const msg = action.payload?.error[0].msg;

		state.error = msg;
	},
	[asyncActions.signin.fulfilled]: (state, action) => {
		state.error = "";

		actions.setUser(state, action);
	},
	[asyncActions.signin.rejected]: (state, action) => {
		const object = action.payload?.error[0];
		let msg = "";

		if (object.nestedErrors) {
			msg = object.nestedErrors[0].msg;
		} else {
			msg = object.msg;
		}

		state.error = msg;
	},
	[asyncActions.comparePassword.fulfilled]: (state) => {
		state.error = "";
	},
	[asyncActions.comparePassword.rejected]: (state, action) => {
		state.error = action.payload?.error;
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
};