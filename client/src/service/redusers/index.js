import { combineReducers } from "@reduxjs/toolkit";

import allProcedures from "./allProcedures.js";
import userProcedures from "./userProcedures.js";
import user from "./user.js";

export default combineReducers({
	allProcedures,
	userProcedures,
	user,
});
