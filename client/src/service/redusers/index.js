import { combineReducers } from "@reduxjs/toolkit";

import langs from "./langs.js";
import navigateDate from "./navigateDate.js";
import procedures from "./procedures.js";
import user from "./user.js";

export default combineReducers({
	langs,
	navigateDate,
	procedures,
	user,
});
