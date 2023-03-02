import { configureStore } from "@reduxjs/toolkit";

import reducer from "@/service/redusers/index.js";

const store = configureStore({
	reducer,
	devTools: true,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({
		serializableCheck: false,
	}),
});

const state = store.getState;

export { state };
export default store;
