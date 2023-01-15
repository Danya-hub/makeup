import { useSelector, useDispatch } from "react-redux";

import { actions as navigateDateActions } from "@/service/redusers/navigateDate.js";
import FormatDate from "@/utils/formatDate.js";
import useDate from "@/hooks/useDate.js";
import useWarning from "@/hooks/useWarning.js";

class useCalendar {
	warningsList = {
		takenProcedureTime: "",
		elapsedDay: "",
		crossingElapsedTime: "",
	};

	dispatch = useDispatch();
	selector = useSelector((state) => state);
	viewState = useDate(new Date(this.selector.navigateDate.date));

	constructor() {
		const [warnings, setWarning, { hasWarning }] = useWarning(this.warningsList);

		const { locale, currentTime } = this.viewState;

		this.warning = {
			warnings,
			setWarning,
			hasWarning,
		};

		this.isCurrentTime = this.selector.navigateDate.isCurrentDate;

		this.hourHeightInPx = window.screen.height / 12;
		this.numericHoursFromDay = FormatDate.hoursByFormat({
			hourFormat: this.selector.langs.currLng,
		});
		this.currentTimeHeightInPx = FormatDate.minutesFromDate(locale, this.hourHeightInPx);
		this.minHour = this.currentTimeHeightInPx / this.hourHeightInPx;
		this.maxHour =
			(this.hourHeightInPx * (this.numericHoursFromDay.length - 1)) / this.hourHeightInPx;

		this.redirectOnNewDate = (newDate, oldDate) => {
			const callback = this.dateDirection(({ isCurrent, isMaxDate, newView }) => {
				if (isCurrent) {
					return [new Date(), true];
				} else {
					return [this[isMaxDate ? "getMaxDate" : "getMinDate"](newView), false];
				}
			});

			return callback(newDate, oldDate);
		};

		this.dateDirection = (callback) => {
			return function (newView, currentTime) {
				const selectDay = newView.getDate(),
					selectMonth = newView.getMonth() + 1,
					selectYear = newView.getFullYear();

				const isMinDate =
					currentTime.year < selectYear ||
					(currentTime.year <= selectYear && currentTime.month < selectMonth) ||
					(currentTime.year <= selectYear &&
						currentTime.month <= selectMonth &&
						currentTime.day < selectDay);
				const isMaxDate =
					currentTime.year > selectYear ||
					(currentTime.year >= selectYear && currentTime.month > selectMonth) ||
					(currentTime.year >= selectYear &&
						currentTime.month >= selectMonth &&
						currentTime.day > selectDay);
				const isCurrentDate = !(isMaxDate || isMinDate);

				return callback({
					isCurrent: isCurrentDate,
					isMaxDate,
					isMinDate,
					newView,
				});
			};
		};

		this.getMinDate = (date) => {
			return FormatDate.minutesToDate(0, date, false);
		};

		this.getMaxDate = (date) => {
			return FormatDate.minutesToDate(this.maxHour * 60 - 1, date, false);
		};

		this.switchDayOnOther = (date) => {
			const [newDate, isCurrent] = this.redirectOnNewDate(date, currentTime.current);
			const selectMinutes = FormatDate.minutesFromDate(newDate, this.hourHeightInPx);
			const isElapsed = this.isElapsedDay(selectMinutes);

			this.dispatch(navigateDateActions.setNavigateDate([newDate, isCurrent]));
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

		this.isElapsedDay = (minutes) => {
			return this.maxHour === Math.floor((minutes + 1) / 60);
		};
	}
}

export { useCalendar as default };
