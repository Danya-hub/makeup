/* eslint-disable no-use-before-define */

import {
	createSlice,
} from "@reduxjs/toolkit";

import {
	actions as reducers,
	asyncActions,
	extraReducers,
} from "@/service/actions/userProcedures.js";
import helper from "@/service/helpers/userProcedures.js";

function initialState(date) {
	const timeSystem = {
		year: date.getFullYear(),
		month: date.getMonth(),
		day: date.getDate(),
		hour: 0,
	};
	this.strictTimeObject = timeSystem;

	const newDate = helper.setDirection(this, date);

	this.hourHeightInPx = 60;
	this.dragStep = 0.5;
	this.currentTimeHeightInPx = 0;
	this.newProcedures = [];
	this.currentProcedure = null;
	this.minTimeRangeProc = 0;
	this.isLoading = true;
	this.maxTimeRangeProc = 0;
	this.lastItemAfterAction = 0;
	this.error = "";

	helper.setDayRange(newDate, this);
	helper.getDayRange(this);

	this.defaultProcedure = {
		...timeSystem,
		hour: this.minDayTime,
	};

	return this;
}

const {
	actions,
	reducer,
} = createSlice({
	name: "userProcedures",
	initialState: initialState.call({}, new Date()),
	extraReducers,
	reducers,
});

export {
	asyncActions,
	actions,
};
export default reducer;