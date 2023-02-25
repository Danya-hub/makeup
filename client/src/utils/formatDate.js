export const MAX_COUNT_WEEKDAYS = 7;
export const MAX_COUNT_WEEKS_IN_CALENDAR = 6;
export const MAX_LENGTH_SYMBOLS_TIME = 2;

function generateDate(date) {
	return new Date(date.year, date.month - 1, date.day || 0);
}

class FormatDate {
	constructor() {}

	dateStyle(date, locale = "default", style = "short") {
		return Intl.DateTimeFormat(locale, {
			dateStyle: style,
		}).format(date);
	}

	numericPeriod(period) {
		return /p/i.test(period) ? 12 : 0;
	}

	weekdayAndMonth(date, locale = "default", options = {}) {
		const formats = {
			weekday: "long",
			day: "numeric",
			month: "long",
		};

		return Intl.DateTimeFormat(locale, {
			...formats,
			...options,
		}).format(date);
	}

	stringHourAndMin(date, locale = "default") {
		return Intl.DateTimeFormat(locale, {
			hour: "numeric",
			minute: "numeric",
		}).format(date);
	}

	unitTimeFromOtherDate(units, toDate, fromDate) {
		const _date = new Date(toDate.getTime());

		units.forEach((unitName) => {
			_date[`set${unitName}`](fromDate[`get${unitName}`]());
		});

		return _date;
	}

	minutesToDate(value, originDate, withCurrent = true) {
		const date = new Date(originDate?.getTime() || Date.now());

		if (!withCurrent) {
			date.setHours(0);
			date.setSeconds(0);
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
			(parseFloat(hours) || 0) + (parseFloat(minutes) || 0) / 60 + this.numericPeriod(period);

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

		_date.setHours(hours > 12 ? hours : Number(hours) + this.numericPeriod(timeString));
		_date.setMinutes(/\d/.test(minutes) ? minutes : 0);

		return _date;
	}

	hoursByFormat({
		hourFormat = "default",
		initialState = {
			minutes: 0,
			hours: 0,
		},
		step = 1,
		maxHour = 25,
	}) {
		const date = new Date(),
			hours = [];

		date.setHours(initialState.hours);
		date.setMinutes(initialState.minutes);

		let ind = Math.ceil((initialState.hours + initialState.minutes / 60) / step) * step;

		while (maxHour > ind) {
			date.setHours(0);
			date.setMinutes(ind * 60);

			hours.push(this.stringHourAndMin(date, hourFormat));

			ind += step;
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
				generateDate({
					year,
					month,
					day: 32,
				}).getDate(),
			firstWeekday =
				generateDate({
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
}

export default new FormatDate();
