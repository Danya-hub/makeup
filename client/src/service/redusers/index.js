import { combineReducers } from "@reduxjs/toolkit";

import navigateDate from "./navigateDate.js";
import allProcedures from "./allProcedures.js";
import userProcedures from "./userProcedures.js";
import user from "./user.js";

export default combineReducers({
	navigateDate,
	allProcedures,
	userProcedures,
	user,
});
