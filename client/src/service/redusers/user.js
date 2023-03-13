/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */

import {
	createSlice,
	createAsyncThunk,
} from "@reduxjs/toolkit";

import axios from "@/http/axios.js";
import reducers from "@/service/actions/user.js";

const initialState = {
	info: null,
	error: null,
};

export const refresh = createAsyncThunk(
	"user/refresh",
	async (_, {
		dispatch,
		rejectWithValue,
	}) => {
		try {
			const user = await axios.indGet("/auth/refresh");
			localStorage.setItem("token", user.data.accessToken);

			dispatch(actions.setUser(user.data));

			return user;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	},
);

export const signup = createAsyncThunk(
	"user/signup",
	async (value, {
		rejectWithValue,
		dispatch,
	}) => {
		try {
			const createdUser = await axios.post("/auth/signup", value);
			localStorage.setItem("token", createdUser.data.accessToken);

			dispatch(actions.setUser(createdUser.data));

			return createdUser;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	},
);

export const signin = createAsyncThunk(
	"user/signin",
	async (value, {
		dispatch,
		rejectWithValue,
	}) => {
		try {
			const foundUser = await axios.post("/auth/signin", value);
			localStorage.setItem("token", foundUser.data.accessToken);

			dispatch(actions.setUser(foundUser.data));

			return foundUser;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	},
);

export const logout = createAsyncThunk("user/logout", async (_, {
	dispatch,
	rejectWithValue,
}) => {
	try {
		const requestState = await axios.post("/auth/logout");
		localStorage.removeItem("token");

		dispatch(actions.setUser(null));

		return requestState;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const sendPasswordForCompare = createAsyncThunk(
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
);

export const comparePassword = createAsyncThunk(
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
);

export const sendLinkForResetingPassword = createAsyncThunk(
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
);

export const resetPassword = createAsyncThunk(
	"user/resetPassword",
	async (value, {
		rejectWithValue,
	}) => {
		try {
			const {
				key,
				email,
				newPassword,
			} = value;

			const requestState = await axios.indPost(`/auth/resetPassword?key=${key}&email=${email}`, {
				newPassword,
			});

			return requestState;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	},
);

const {
	reducer,
	actions,
} = createSlice({
	name: "user",
	initialState,
	reducers,
	extraReducers: {
		[sendPasswordForCompare.fulfilled]: (state) => {
			state.error = "";
		},
		[sendPasswordForCompare.rejected]: (state, action) => {
			const msg = action.payload?.error[0].msg;

			state.error = msg;
		},
		[signin.fulfilled]: (state) => {
			state.error = "";
		},
		[signin.rejected]: (state, action) => {
			const object = action.payload?.error[0];
			let msg = "";

			if (object.nestedErrors) {
				msg = object.nestedErrors[0].msg;
			} else {
				msg = object.msg;
			}

			state.error = msg;
		},
		[comparePassword.fulfilled]: (state) => {
			state.error = "";
		},
		[comparePassword.rejected]: (state, action) => {
			state.error = action.payload?.error;
		},
		[sendLinkForResetingPassword.fulfilled]: (state) => {
			state.error = "";
		},
		[sendLinkForResetingPassword.rejected]: (state, action) => {
			state.error = action.payload?.error;
		},
		[resetPassword.fulfilled]: (state) => {
			state.error = "";
		},
		[resetPassword.rejected]: (state, action) => {
			state.error = action.payload?.error;
		},
		[resetPassword.pending]: (state) => {
			state.error = "";
		},
		[refresh.rejected]: () => {
			localStorage.removeItem("token");
		},
	},
});

export {
	actions,
};
export default reducer;
