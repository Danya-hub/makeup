import ProcConfig from "@/config/procedures.js";
import FormatDate from "@/utils/formatDate.js";

const userProceduresHelper = {
	getDayRange(state) {
		const timeState = state;

		const minY = this.getDragY(
			timeState.currentTimeHeightInPx,
			timeState,
		);
		const maxY = this.getDragY(
			timeState.hourHeightInPx * ProcConfig.FINISH_WORK_TIME,
			timeState,
		);

		timeState.minDayTime = minY / timeState.hourHeightInPx + ProcConfig.START_WORK_TIME;
		timeState.maxDayTime = maxY / timeState.hourHeightInPx;
	},

	setDayRange(date, state) {
		const timeState = state;

		if (timeState.isCurrentTime) {
			const max = (ProcConfig.FINISH_WORK_TIME - ProcConfig.START_WORK_TIME) * 60;
			const currentTimeHeightInPx = FormatDate.minutesFromDate(date, timeState.hourHeightInPx)
				- ProcConfig.START_WORK_TIME * 60;

			timeState.locale = date;

			if (currentTimeHeightInPx < 0) {
				timeState.currentTimeHeightInPx = 0;
			} else if (currentTimeHeightInPx > max) {
				timeState.currentTimeHeightInPx = max;
			} else {
				timeState.currentTimeHeightInPx = currentTimeHeightInPx;
			}

			return;
		}

		if (timeState.isPrevTime) {
			timeState.locale = this.getMaxDate(date, {
				maxHour: ProcConfig.FINISH_WORK_TIME,
			});
			timeState.currentTimeHeightInPx = (ProcConfig.FINISH_WORK_TIME - ProcConfig.START_WORK_TIME)
				* 60;
		} else {
			timeState.locale = this.getMinDate(date, {
				minHour: ProcConfig.START_WORK_TIME,
			});
			timeState.currentTimeHeightInPx = 0;
		}
	},

	getRangeProcTime(state, procedure) {
		const [currentProcedure] = state.currentProcedure;

		const startProcMinutes = currentProcedure.hour * 60;
		const finishProcMinutes = startProcMinutes + procedure.type.duration * 60;
		const startProcTime = FormatDate.minutesToDate(
			startProcMinutes,
			state.locale,
			false,
		);
		const finishProcTime = FormatDate.minutesToDate(
			finishProcMinutes,
			state.locale,
			false,
		);

		return {
			...procedure,
			startProcTime,
			finishProcTime,
		};
	},

	setDirection(state, date) {
		const timeState = state;

		const [newDate, direction] = this.redirectOnNewDate(date, {
			minHour: ProcConfig.START_WORK_TIME,
			maxHour: ProcConfig.FINISH_WORK_TIME,
			...state.strictTimeObject,
		});

		timeState.isNextTime = direction.isNext;
		timeState.isPrevTime = direction.isPrev;
		timeState.isCurrentTime = direction.isCurrent;

		return newDate;
	},

	setMonth(state, date, month) {
		const {
			currentProcedure: [currentProcedure],
			defaultProcedure,
		} = state;
		let localeMonth = 0;

		if (currentProcedure.month > month) {
			localeMonth = (date.getMonth() || 12) - 1;

			date.setFullYear(date.getFullYear() - (!(month % 12) ? 1 : 0));
			date.setMonth(localeMonth);
		} else {
			localeMonth = date.getMonth() + 1;

			date.setMonth(localeMonth);
		}

		defaultProcedure.month = localeMonth;
		currentProcedure.month = localeMonth;
		defaultProcedure.hour = FormatDate.numericHoursFromDate(date);
	},

	setDay(state, date) {
		const {
			currentProcedure: [currentProcedure],
			defaultProcedure,
		} = state;
		const day = date.getDate();

		currentProcedure.day = day;
		defaultProcedure.day = day;
		defaultProcedure.hour = FormatDate.numericHoursFromDate(date);
	},

	dateDirection(newView, strict) {
		const selectHour = newView.getHours();
		const selectDay = newView.getDate();
		const selectMonth = newView.getMonth();
		const selectYear = newView.getFullYear();

		const isPrev = strict.year > selectYear
			|| (strict.year >= selectYear && strict.month > selectMonth)
			|| (strict.year >= selectYear
				&& strict.month >= selectMonth
				&& strict.day > selectDay)
			|| (strict.year >= selectYear
				&& strict.month >= selectMonth
				&& strict.day >= selectDay
				&& strict.maxHour <= selectHour);
		const isNext = strict.year < selectYear
			|| (strict.year <= selectYear && strict.month < selectMonth)
			|| (strict.year <= selectYear
				&& strict.month <= selectMonth
				&& strict.day < selectDay);
		const isCurrentDate = !(isNext || isPrev);

		return {
			isCurrent: isCurrentDate,
			isPrev,
			isNext,
			newView,
		};
	},

	getMinDate(date, {
		minHour,
	}) {
		return FormatDate.minutesToDate(minHour * 60, date, false);
	},

	getMaxDate(date, {
		maxHour,
	}) {
		return FormatDate.minutesToDate(maxHour * 60 - 1, date, false);
	},

	isElapsedDay(maxHour, minutes) {
		return maxHour === Math.floor((minutes + 1) / 60);
	},

	redirectOnNewDate(newDate, strict) {
		const direction = this.dateDirection(newDate, strict);

		if (direction.isCurrent) {
			return [new Date(), direction];
		}

		return [
			this[direction.isPrev ? "getMaxDate" : "getMinDate"](direction.newView, strict),
			direction,
		];
	},

	getDragY(pageY, states) {
		return Math.ceil(pageY / states.hourHeightInPx / states.dragStep)
			* states.hourHeightInPx * states.dragStep;
	},
};

export default userProceduresHelper;