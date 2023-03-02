import { createSlice } from "@reduxjs/toolkit";

import i18next, { langs as arrayLangs } from "@/lang/index.js";
import reducers from "@/service/actions/langs.js";

const initialState = {
	currLng: i18next.language,
	arrayLangs,
};

const { actions, reducer } = createSlice({
	name: "langs",
	initialState,
	reducers,
});

export { actions };
export default reducer;
