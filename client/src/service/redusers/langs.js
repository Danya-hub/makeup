import { createSlice } from "@reduxjs/toolkit";

import i18next from "@/lang/index.js";
import * as reducers from "@/service/actions/langs.js";
import { langs as arrayLangs } from "@/lang/index.js";

const initialState = {
	currLng: i18next.language,
	arrayLangs,
};

const { actions, reducer } = createSlice({
	name: "langs",
	initialState,
	reducers,
});

export { reducer as default, actions };
