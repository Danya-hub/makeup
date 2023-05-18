import ProcConfig from "@/config/procedures.js";
import FormatDate from "@/utils/formatDate.js";

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

	availableTypesBySpace(state, { //!
		minHour = 0,
		maxHour = 24,
	}) {
		if (minHour >= maxHour) {
			return [];
		}

		if (!state.newProcedures.length) {
			return state.types;
		}

		// const availableTypes = state.types.filter((type) => {
		// 	let hasSpace = true;

		// 	for (let i = 0; i < state.newProcedures.length && hasSpace; i += 1) {
		// 		const a = state.newProcedures[i][0];

		// 		for (let j = 0; j < state.newProcedures.length && hasSpace; j += 1) {
		// 			const b = state.newProcedures[j][0];

		// 			if (i !== j) {
		// 				// hasSpace = (a.hour - type.duration <= ProcConfig.START_WORK_TIME ?
		// 				// 		ProcConfig.START_WORK_TIME : a.hour - type.duration) >
		// 				// 	b.hour + b.type.duration &&
		// 				// 	(a.hour + a.type.duration + type.duration >= ProcConfig.FINISH_WORK_TIME ?
		// 				// 		ProcConfig.FINISH_WORK_TIME : a.hour + a.type.duration + type.duration) <=
		// 				// 	b.hour;

		// 				const startSegment = (a.hour - type.duration);
		// 				const finishSegment = a.hour + a.type.duration + type.duration;

		// 				hasSpace = !(startSegment < b.hour && finishSegment > b.hour + type.duration)
		// 					|| !(b.hour < startSegment && b.hour + type.duration > finishSegment);
		// 			}
		// 		}

		// 		if (!hasSpace) {
		// 			console.log(hasSpace);
		// 		}
		// 	}

		// 	return hasSpace;
		// });
		// console.log(availableTypes);

		return state.types;
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
			skipCondition: (time) => this.isTouchCardBySelectedTime(
				time,
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

	isTouchCardBySelectedTime(selectedTime, duration, state) {
		const [currentProcedure] = state.currentProcedure;
		let isTouch = false;

		const newProcedures = state.newProcedures
			.filter(([card, isSelected]) => !isSelected && card.day === currentProcedure.day)
			.map(([card]) => card);
		const proceduresByDay = state.proceduresByDay
			.filter((card) => currentProcedure.id !== card.id && card.day === currentProcedure.day);

		[...newProcedures, ...proceduresByDay]
			.forEach((card) => {
				if (isTouch) {
					return;
				}

				const startSegment = (card.hour - duration);
				const finishSegment = card.hour + card.type.duration + duration;

				isTouch = (startSegment < selectedTime && finishSegment > selectedTime + duration)
					|| (selectedTime < startSegment && selectedTime + duration > finishSegment);
			});

		return isTouch;
	},
};

export default userProceduresHelper;