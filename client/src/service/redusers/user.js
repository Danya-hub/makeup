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
			localStorage.setItem("isAuth", true);

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
			localStorage.setItem("isAuth", true);

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
			localStorage.setItem("isAuth", true);

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
		localStorage.removeItem("isAuth");

		dispatch(actions.setUser(null));

		return requestState;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

export const sendPassword = createAsyncThunk(
	"user/sendPassword",
	async (value, {
		rejectWithValue,
	}) => {
		try {
			const {
				passwordToken,
			} = await axios
				.indPost("/auth/sendPassword", value)
				.then((res) => res.data);

			return passwordToken;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	},
);

export const checkPassword = createAsyncThunk(
	"user/checkPassword",
	async (value, {
		rejectWithValue,
	}) => {
		try {
			const user = await axios.indPost("/auth/checkPassword", value).then((res) => res.data);

			return user;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	},
);

export const requestResetPassword = createAsyncThunk(
	"user/requestResetPassword",
	async (value, {
		rejectWithValue,
	}) => {
		try {
			const requestState = await axios.indPost("/auth/requestResetPassword", value);

			return requestState;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	},
);

export const checkNewPassword = createAsyncThunk(
	"user/checkNewPassword",
	async (value, {
		rejectWithValue,
	}) => {
		try {
			const {
				key,
				email,
				newPassword,
			} = value;

			const requestState = await axios.indPost(`/auth/checkNewPassword?key=${key}&email=${email}`, {
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
		[sendPassword.fulfilled]: (state) => {
			state.error = "";
		},
		[sendPassword.rejected]: (state, action) => {
			const msg = action.payload?.error[0].msg;

			state.error = msg;
		},
		[signin.fulfilled]: (state) => {
			state.error = "";
		},
		[signin.rejected]: (state, action) => {
			const msg = action.payload?.error[0].msg;

			state.error = msg;
		},
		[checkPassword.fulfilled]: (state) => {
			state.error = "";
		},
		[checkPassword.rejected]: (state, action) => {
			state.error = action.payload?.error;
		},
		[requestResetPassword.fulfilled]: (state) => {
			state.error = "";
		},
		[requestResetPassword.rejected]: (state, action) => {
			state.error = action.payload?.error;
		},
		[checkNewPassword.fulfilled]: (state) => {
			state.error = "";
		},
		[checkNewPassword.rejected]: (state, action) => {
			state.error = action.payload?.error;
		},
		[checkNewPassword.pending]: (state) => {
			state.error = "";
		},
		[refresh.rejected]: () => {
			localStorage.removeItem("isAuth");
		},
	},
});

export {
	actions,
};
export default reducer;
