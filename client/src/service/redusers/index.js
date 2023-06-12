import {
	combineReducers,
} from "@reduxjs/toolkit";

import appointments from "./appointments.js";
import user from "./user.js";
import userProcedures from "./userProcedures.js";

export default combineReducers({
	appointments,
	user,
	userProcedures,
});