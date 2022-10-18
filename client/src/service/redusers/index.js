import { combineReducers } from "@reduxjs/toolkit";

import langs from "./langs.js";
import navigateDate from "./navigateDate.js";
import allProcedures from "./allProcedures.js";
import userProcedures from "./userProcedures.js";
import user from "./user.js";

export default combineReducers({
	langs,
	navigateDate,
	allProcedures,
	userProcedures,
	user,
});
