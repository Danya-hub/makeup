import ProcConfig from "@/config/procedures.js";
import FormatDate from "@/utils/formatDate.js";
import AllProceduresHelper from "@/service/helpers/allProcedures.js";

const userProceduresHelper = {
	setDayRange(state) {
		const userProcState = state;

		const minY = this.getDragY(
			userProcState.currentTimeHeightInPx,
			userProcState,
		);
		const maxY = this.getDragY(
			userProcState.hourHeightInPx * ProcConfig.FINISH_WORK_TIME,
			userProcState,
		);

		userProcState.minDayTime = minY / userProcState.hourHeightInPx + ProcConfig.START_WORK_TIME;
		userProcState.maxDayTime = maxY / userProcState.hourHeightInPx;
	},

	setViewDate(date, state) {
		const userProcState = state;

		if (userProcState.isCurrentTime) {
			const max = (ProcConfig.FINISH_WORK_TIME - ProcConfig.START_WORK_TIME)
				* userProcState.hourHeightInPx;
			const currentTimeHeightInPx = FormatDate.minutesFromDate(date, userProcState.hourHeightInPx)
				- ProcConfig.START_WORK_TIME * userProcState.hourHeightInPx;

			userProcState.locale = date;

			if (currentTimeHeightInPx < 0) {
				userProcState.currentTimeHeightInPx = 0;
			} else if (currentTimeHeightInPx > max) {
				userProcState.currentTimeHeightInPx = max;
			} else {
				userProcState.currentTimeHeightInPx = currentTimeHeightInPx;
			}

			return;
		}

		if (userProcState.isPrevTime) {
			userProcState.locale = this.getMaxDate(date, {
				maxHour: ProcConfig.FINISH_WORK_TIME,
			});
			userProcState.currentTimeHeightInPx = (ProcConfig.FINISH_WORK_TIME
				- ProcConfig.START_WORK_TIME) * userProcState.hourHeightInPx;
		} else {
			userProcState.locale = this.getMinDate(date, {
				minHour: ProcConfig.START_WORK_TIME,
			});
			userProcState.currentTimeHeightInPx = 0;
		}
	},

	getRangeProcTime(state, procedure) {
		const [currentProcedure] = state.currentProcedure;

		const startProcMinutes = currentProcedure.hour * state.hourHeightInPx;
		const finishProcMinutes = startProcMinutes + procedure.type.duration * state.hourHeightInPx;
		const startProcTime = FormatDate.minutesToDate(
			startProcMinutes,
			state.locale,
		);
		const finishProcTime = FormatDate.minutesToDate(
			finishProcMinutes,
			state.locale,
		);

		return {
			...procedure,
			startProcTime,
			finishProcTime,
		};
	},

	setDirection(state, date) {
		const userProcState = state;

		const [newDate, direction] = this.redirectOnNewDate(date, {
			minHour: ProcConfig.START_WORK_TIME,
			maxHour: ProcConfig.FINISH_WORK_TIME,
			...state.strictTimeObject,
		});

		userProcState.isNextTime = direction.isNext;
		userProcState.isPrevTime = direction.isPrev;
		userProcState.isCurrentTime = direction.isCurrent;

		return newDate;
	},

	setMonth(state, date, month) {
		const userProcState = state;
		const {
			currentProcedure: [currentProcedure],
			defaultProcedure,
		} = userProcState;
		let localeMonth = 0;
		let localeYear = 0;

		if (currentProcedure.month > month) {
			localeMonth = (date.getMonth() || 12) - 1;
			localeYear = date.getFullYear() - (month < 0 ? 1 : 0);

			date.setFullYear(localeYear);
			date.setMonth(localeMonth);
		} else {
			localeMonth = date.getMonth() + 1;
			localeYear = date.getFullYear();

			date.setMonth(localeMonth);
		}

		defaultProcedure.year = localeYear;
		currentProcedure.year = localeYear;
		defaultProcedure.month = localeMonth;
		currentProcedure.month = localeMonth;
	},

	setDay(state, value) {
		const userProcState = state;
		const {
			currentProcedure: [currentProcedure],
			defaultProcedure,
		} = userProcState;
		const {
			year,
			month,
		} = currentProcedure;
		const date = new Date(year, month, value);
		const day = date.getDate();

		const newDate = this.setDirection(state, date);

		currentProcedure.day = day;
		defaultProcedure.day = day;

		this.setViewDate(newDate, state);
		this.setDayRange(state);
		this.defaultAvailableTimeByDate(state);
	},

	dateDirection(newView, strict) {
		const selectDay = newView.getDate();
		const selectMonth = newView.getMonth();
		const selectYear = newView.getFullYear();

		const isPrev = strict.year > selectYear
			|| (strict.year >= selectYear && strict.month > selectMonth)
			|| (strict.year >= selectYear
				&& strict.month >= selectMonth
				&& strict.day > selectDay);
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
		return FormatDate.minutesToDate(minHour * 60, date);
	},

	getMaxDate(date, {
		maxHour,
	}) {
		return FormatDate.minutesToDate(maxHour * 60 - 1, date);
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

	getDragY(pageY, state) {
		return Math.ceil(pageY / state.hourHeightInPx / state.dragStep)
			* state.hourHeightInPx * state.dragStep;
	},

	availableTimeByScrolling({
		step = 1,
		minHour = 0,
		maxHour = 24,
		skipCondition,
	}) {
		const availableTime = {
			dates: [],
			hours: [],
		};

		let ind = minHour;

		while (maxHour >= ind) {
			const date = new Date();

			date.setHours(0);
			date.setMinutes(ind * 60);

			if (skipCondition) {
				const skip = skipCondition(ind);

				if (skip) {
					ind += step;

					// eslint-disable-next-line no-continue
					continue;
				}
			}

			availableTime.dates.push(date);
			availableTime.hours.push(ind);
			ind += step;
		}

		return availableTime;
	},

	availableTypesByProcedures(state, {
		minHour = 0,
		maxHour = 24,
	}) {
		if (minHour >= maxHour) {
			return [];
		}

		if (!state.newProcedures.length) {
			return state.types;
		}

		const availableTypes = state.types.filter(
			(type) => AllProceduresHelper.hasFreeSpaceByCards(type, state),
		);

		return availableTypes;
	},

	defaultAvailableTimeByDate(state, fromOrigin = false) {
		const userProcState = state;
		const [currentProcedure] = userProcState.currentProcedure;

		userProcState.availableTypes = this.availableTypesByProcedures(userProcState, {
			minHour: userProcState.minDayTime,
			maxHour: ProcConfig.FINISH_WORK_TIME,
		});

		const isSameType = userProcState.availableTypes
			.some((type) => currentProcedure.type.id === type.id);
		if (!isSameType && userProcState.availableTypes.length) {
			// eslint-disable-next-line prefer-destructuring
			currentProcedure.type = userProcState.availableTypes[0];
		}

		const availableDateTime = this.availableTimeByScrolling({
			step: userProcState.dragStep,
			minHour: userProcState.minDayTime,
			maxHour: ProcConfig.FINISH_WORK_TIME - currentProcedure.type.duration,
			skipCondition: (time) => AllProceduresHelper.isTouchCardBySelectedTime(
				time,
				currentProcedure.type.duration,
				{
					newProcedures: userProcState.newProcedures,
					currentProcedure: userProcState.currentProcedure,
				},
			),
		});

		const target = userProcState.newProcedures.length && fromOrigin
			? userProcState.newProcedures[state.lastItemAfterAction][0].hour
			: currentProcedure.hour;

		const availableHour = availableDateTime.hours
			.reduce((prev, curr) => (Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev), 0);

		userProcState.availableDateTime = availableDateTime.dates;
		userProcState.availableHoursTime = availableDateTime.hours;

		if (!availableHour) {
			return;
		}

		currentProcedure.hour = availableHour;
		userProcState.defaultProcedure.hour = currentProcedure.hour;
	},
};

export default userProceduresHelper;