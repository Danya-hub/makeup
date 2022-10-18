import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "@/http/axios.js";
import * as reducers from "@/service/actions/user.js";

const initialState = {
	info: null,
	error: "",
};

const refresh = createAsyncThunk("user/refresh", async (_, { dispatch, rejectWithValue }) => {
	try {
		const user = await axios.get("/auth/refresh");
		dispatch(actions.setUser(user.data));

		return user;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

const signup = createAsyncThunk("user/signup", async (value, { rejectWithValue }) => {
	try {
		const createdUser = await axios.post("/auth/signup", value);

		return createdUser;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

const signin = createAsyncThunk("user/signin", async (value, { dispatch, rejectWithValue }) => {
	try {
		const finedUser = await axios.post("/auth/signin", value);

		dispatch(actions.setUser(finedUser.data));

		return finedUser;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

const logout = createAsyncThunk("user/logout", async (value, { dispatch, rejectWithValue }) => {
	try {
		await axios.post("/auth/logout");

		localStorage.removeItem("token");
		dispatch(actions.setUser(null));
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

const google = createAsyncThunk("user/google", async (_, { dispatch, rejectWithValue }) => {
	try {
		const user = await axios.get("/auth/google");
		dispatch(actions.setUser(user.data));

		return user;
	} catch (error) {
		return rejectWithValue(error.response.data);
	}
});

const { reducer, actions } = createSlice({
	name: "user",
	initialState,
	reducers,
	extraReducers: {
		[signup.fulfilled]: (state) => {
			state.error = "";
		},
		[signup.rejected]: (state, action) => {
			state.error = action.payload[0];
		},
		[signin.fulfilled]: (state) => {
			state.error = "";
		},
		[signin.rejected]: (state, action) => {
			state.error = action.payload[0];
		},
	},
});

export { reducer as default, actions, signup, signin, google, refresh, logout };
