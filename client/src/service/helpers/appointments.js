import ProcConfig from "@/config/procedures.js";
import FormatDate from "@/utils/formatDate.js";

const appointmentsHelper = {
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

	setProceduresByDay(state) {
		const userProcState = state;
		const [currentProcedure] = userProcState.currentProcedure;

		const newProcedures = userProcState.newProcedures
			.filter(([card, isSelected]) => !isSelected
				&& card.day === currentProcedure.day
				&& card.month === currentProcedure.month
				&& card.year === currentProcedure.year)
			.map(([card]) => card);
		const addedUserProcedures = userProcState.addedUserProcedures
			.filter((card) => currentProcedure.id !== card.id);

		userProcState.proceduresByDay = [...newProcedures, ...addedUserProcedures];
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

	availableTimeByDay({
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

	availableTypesBySpace(state, {
		minHour = 0,
		maxHour = 24,
	}) {
		if (minHour >= maxHour) {
			return [];
		}

		if (!state.proceduresByDay.length) {
			return state.types;
		}

		const availableTypes = state.types.filter((type) => {
			let hasSpace = false;

			for (let i = 0; i < state.proceduresByDay.length && !hasSpace; i += 1) {
				const hasCardTopSegment = ProcConfig.START_WORK_TIME > state.proceduresByDay[i].hour
					- type.duration
					|| this.isTouchCardBySelectedTime(
						state.proceduresByDay[i].hour - type.duration,
						type.duration,
						state,
					);
				const hasCardBottomSegment = ProcConfig.FINISH_WORK_TIME < state.proceduresByDay[i].hour
					+ state.proceduresByDay[i].type.duration + type.duration
					|| this.isTouchCardBySelectedTime(
						state.proceduresByDay[i].hour + state.proceduresByDay[i].type.duration,
						type.duration,
						state,
					);

				hasSpace = !hasCardTopSegment || !hasCardBottomSegment;
			}

			return hasSpace;
		});

		return availableTypes;
	},

	defaultAvailableTimeByDate(state, fromOrigin = false) {
		const userProcState = state;
		const [currentProcedure] = userProcState.currentProcedure;

		userProcState.availableTypes = this.availableTypesBySpace(userProcState, {
			minHour: userProcState.minDayTime,
			maxHour: ProcConfig.FINISH_WORK_TIME,
		});

		const isSameType = userProcState.availableTypes
			.some((type) => currentProcedure.type.id === type.id);
		if (!isSameType && userProcState.availableTypes.length) {
			// eslint-disable-next-line prefer-destructuring
			currentProcedure.type = userProcState.availableTypes[0];
		}

		const availableDateTime = this.availableTimeByDay({
			step: userProcState.dragStep,
			minHour: userProcState.minDayTime,
			maxHour: ProcConfig.FINISH_WORK_TIME - currentProcedure.type.duration,
			skipCondition: (originTime) => this.isTouchCardBySelectedTime(
				originTime,
				currentProcedure.type.duration,
				userProcState,
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

	isTouchCardBySelectedTime(time, timeDuration, state) {
		const isTouch = state.proceduresByDay
			.some((card) => {
				const startSegment = (card.hour - timeDuration);
				const finishSegment = card.hour + card.type.duration + timeDuration;

				return (startSegment < time && finishSegment > time + timeDuration)
					|| (time < startSegment && time + timeDuration > finishSegment);
			});

		return isTouch;
	},
};

export default appointmentsHelper;