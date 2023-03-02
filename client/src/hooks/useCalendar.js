import {
	useSelector,
	useDispatch,
} from "react-redux";

import {
	actions as navigateDateActions,
} from "@/service/redusers/navigateDate.js";
import FormatDate from "@/utils/formatDate.js";
import useDate from "@/hooks/useDate.js";
import useWarning from "@/hooks/useWarning.js";

function useCalendar() {
	const dispatch = useDispatch();
	const selector = useSelector((state) => state);

	this.warningsList = {
		takenProcedureTime: "",
		elapsedDay: "",
		crossingElapsedTime: "",
	};

	this.viewState = useDate(new Date(selector.navigateDate.date));
	this.getDragY = (pageY) => Math.ceil(pageY / this.hourHeightInPx / this.dragStep)
		* this.hourHeightInPx * this.dragStep;

	const [warnings, setWarning, {
		checkOnWarning,
	}] = useWarning(this.warningsList);
	const {
		locale,
		strictTimeObject,
	} = this.viewState;

	this.warning = {
		warnings,
		setWarning,
		checkOnWarning,
	};

	this.isCurrentTime = selector.navigateDate.isCurrentDate;

	this.hourHeightInPx = 60;
	this.dragStep = 0.5;
	this.numericHoursFromDay = FormatDate.hoursByFormat({
		hourFormat: selector.langs.currLng,
	});
	this.currentTimeHeightInPx = FormatDate.minutesFromDate(locale, this.hourHeightInPx);
	this.minHour = this.getDragY(this.currentTimeHeightInPx) / this.hourHeightInPx;
	this.maxHour = this.getDragY(this.hourHeightInPx * (this.numericHoursFromDay.length - 1))
		/ this.hourHeightInPx;

	this.redirectOnNewDate = (newDate, oldDate) => {
		const callback = this.dateDirection(({
			isCurrent,
			isMaxDate,
			newView,
		}) => {
			if (isCurrent) {
				return [new Date(), true];
			}
			return [this[isMaxDate ? "getMaxDate" : "getMinDate"](newView), false];
		});

		return callback(newDate, oldDate);
	};

	this.dateDirection = (callback) => (newView, strict) => {
		const selectDay = newView.getDate();
		const selectMonth = newView.getMonth() + 1;
		const selectYear = newView.getFullYear();

		const isMinDate = strict.year < selectYear
			|| (strict.year <= selectYear && strict.month < selectMonth)
			|| (strict.year <= selectYear
				&& strict.month <= selectMonth
				&& strict.day < selectDay);
		const isMaxDate = strict.year > selectYear
			|| (strict.year >= selectYear && strict.month > selectMonth)
			|| (strict.year >= selectYear
				&& strict.month >= selectMonth
				&& strict.day > selectDay);
		const isCurrentDate = !(isMaxDate || isMinDate);

		return callback({
			isCurrent: isCurrentDate,
			isMaxDate,
			isMinDate,
			newView,
		});
	};

	this.getMinDate = (date) => FormatDate.minutesToDate(0, date, false);

	this.getMaxDate = (date) => FormatDate.minutesToDate(this.maxHour * 60 - 1, date, false);

	this.switchDayOnOther = (date) => {
		const [newDate, isCurrent] = this.redirectOnNewDate(date, strictTimeObject.current);
		const selectMinutes = FormatDate.minutesFromDate(newDate, this.hourHeightInPx);
		const isElapsed = this.isElapsedDay(selectMinutes);

		dispatch(navigateDateActions.setNavigateDate([newDate, isCurrent]));
		this.warning.setWarning(["elapsedDay", isElapsed ? "elapsedDay" : ""]);

		return {
			newDate,
			isCurrent,
			isElapsed,
		};
	};

	this.setUnitForDate = (unitArr, oldDatesUnits, newDateUnits) => {
		const rez = {};
		const entries = Object.entries(oldDatesUnits);

		entries.forEach(([key, value]) => {
			rez[key] = FormatDate.unitTimeFromOtherDate(unitArr, value, newDateUnits);
		});

		return rez;
	};

	this.isElapsedDay = (minutes) => this.maxHour === Math.floor((minutes + 1) / 60);

	return this;
}

export default useCalendar;
