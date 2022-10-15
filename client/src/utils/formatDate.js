import { MAX_COUNT_WEEKDAYS, MAX_COUNT_WEEKS_IN_CALENDAR } from "@/constants/calendar.js";

function getNewDateFromOld(date) {
	return new Date(date.year, date.month - 1, date.day || 0);
}

const FormatDate = new (class FormatDate {
	getNumberNoonByPeriod(period) {
		return /p/i.test(period) ? 12 : 0;
	}

	weekdayAndMonth(date, format = "default") {
		if (!date) {
			return "";
		}

		const weekday = date.toLocaleString(format, {
				weekday: "long",
			}),
			month = date.toLocaleString(format, {
				month: "long",
			});

		return `${weekday}, ${date.getDate()} ${month}`;
	}

	stringHourAndMin(date, format) {
		const _date = date || new Date();

		return _date.toLocaleTimeString(format, {
			hour: "numeric",
			minute: "numeric",
		});
	}

	unitTimeFromOtherDate(units, toDate, fromDate) {
		const _date = new Date(toDate?.getTime() || Date.now());

		units.forEach((unitName) => {
			_date[`set${unitName}`](fromDate[`get${unitName}`]());
		});

		return _date;
	}

	minutesInDate(value, originDate, withCurrent = true) {
		const date = new Date(originDate?.getTime() || Date.now());

		if (!withCurrent) {
			date.setHours(0);
			date.setMinutes(0);
		}

		date.setMinutes((withCurrent ? date.getMinutes() : 0) + (value || 0));

		return date;
	}

	numericHoursFromDate(date) {
		if (!date) {
			return;
		}

		return date.getHours() + date.getMinutes() / 60;
	}

	numericTimeFromChar(chars) {
		const [hours, minutes, period] = chars.split(/((?<=\b)(a|p))|:/i).filter(Boolean);
		const time =
			(parseFloat(hours) || 0) +
			(parseFloat(minutes) || 0) / 60 +
			this.getNumberNoonByPeriod(period);

		return time || 0;
	}

	minutesFromDate(date, hourHeight = 0) {
		return date.getHours() * hourHeight + (date.getMinutes() / 60) * hourHeight;
	}

	dateFromStringTime(timeString, date) {
		const b = timeString.match(/\d+/g);

		if (!b) {
			return;
		}

		const [hours, minutes] = b;
		const _date = new Date(date?.getTime() || Date.now());

		_date.setHours(hours > 12 ? hours : Number(hours) + this.getNumberNoonByPeriod(timeString));
		_date.setMinutes(/\d/.test(minutes) ? minutes : 0);

		return _date;
	}

	dayFormatFromCurrentTime(callback) {
		return function (date, noChangeDate) {
			const selectDay = date.getDate(),
				selectMonth = date.getMonth() + 1,
				selectYear = date.getFullYear();

			const isMinDate =
				noChangeDate.current.year < selectYear ||
				(noChangeDate.current.year <= selectYear && noChangeDate.current.month < selectMonth) ||
				(noChangeDate.current.year <= selectYear &&
					noChangeDate.current.month <= selectMonth &&
					noChangeDate.current.day < selectDay);
			const isMaxDate =
				noChangeDate.current.year > selectYear ||
				(noChangeDate.current.year >= selectYear && noChangeDate.current.month > selectMonth) ||
				(noChangeDate.current.year >= selectYear &&
					noChangeDate.current.month >= selectMonth &&
					noChangeDate.current.day > selectDay);
			const isCurrentTime = !(isMaxDate || isMinDate);

			return callback({
				isCurrent: isCurrentTime,
				isMaxDate,
				isMinDate,
				date,
			});
		};
	}

	hoursByFormat({
		hourFormat = "default",
		initialState = {
			minutes: 0,
			hours: 0,
		},
	}) {
		const date = new Date(),
			hours = [];
		const day = date.getDay();

		date.setMinutes(initialState.minutes);
		date.setHours(initialState.hours);

		let currHour = 0;
		while (date.getDay() === day) {
			date.setHours(currHour++);
			hours.push(this.stringHourAndMin(date, hourFormat));
		}

		return hours;
	}

	allDaysOnMonth(date) {
		const _date = new Date(date?.getTime() || Date.now());
		const year = _date.getFullYear();
		const month = _date.getMonth() + 1;

		const days = [];
		const lastMonth =
				32 -
				getNewDateFromOld({
					year,
					month,
					day: 32,
				}).getDate(),
			firstWeekday =
				getNewDateFromOld({
					year,
					month,
				}).getDay() + 1;

		let iterator = 1,
			space = 0;
		while (space++ <= MAX_COUNT_WEEKDAYS * MAX_COUNT_WEEKS_IN_CALENDAR - 1) {
			days.push(space < firstWeekday || lastMonth < iterator ? false : iterator++);
			_date.setDate(iterator);
		}

		return days;
	}
})();

export { FormatDate as default };
