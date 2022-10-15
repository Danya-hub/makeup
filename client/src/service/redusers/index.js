import { combineReducers } from "@reduxjs/toolkit";

import langs from "./langs.js";
import navigateDate from "./navigateDate.js";
import procedure from "./procedure.js";
import user from "./user.js";

export default combineReducers({
	langs,
	navigateDate,
	procedure,
	user,
});
