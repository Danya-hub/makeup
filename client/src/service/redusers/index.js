import { combineReducers } from "@reduxjs/toolkit";

import userProcedures from "./userProcedures.js";
import user from "./user.js";

export default combineReducers({
	userProcedures,
	user,
});
