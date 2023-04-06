export const MAX_COUNT_WEEKDAYS = 7;
export const MAX_COUNT_WEEKS_IN_CALENDAR = 6;
export const MAX_LENGTH_SYMBOLS_TIME = 2;

function generateDate(date) {
	return new Date(date.year, date.month - 1, date.day || 0);
}

const formatDate = {
	dateStyle(date, locale = "default", style = "short") {
		return Intl.DateTimeFormat(locale, {
			dateStyle: style,
		}).format(date);
	},

	numericPeriod(period) {
		return /p/i.test(period) ? 12 : 0;
	},

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
	},

	stringHourAndMin(date, locale = "default") {
		return Intl.DateTimeFormat(locale, {
			hour: "numeric",
			minute: "numeric",
		}).format(date);
	},

	unitTimeFromOtherDate(units, toDate, fromDate) {
		const date = new Date(toDate.getTime());

		units.forEach((unitName) => {
			date[`set${unitName}`](fromDate[`get${unitName}`]());
		});

		return date;
	},

	minutesToDate(value, originDate, withCurrent = true) {
		const date = new Date(originDate?.getTime() || Date.now());

		if (!withCurrent) {
			date.setHours(0);
			date.setSeconds(0);
		}

		date.setMinutes((withCurrent ? date.getMinutes() : 0) + (value || 0));

		return date;
	},

	numericHoursFromDate(date) {
		if (!date) {
			return null;
		}

		return date.getHours() + date.getMinutes() / 60;
	},

	numericTimeFromChar(chars) {
		const [hours, minutes, period] = chars.split(/((?<=\b)(a|p))|:/i).filter(Boolean);
		const time = (parseFloat(hours) || 0)
			+ (parseFloat(minutes) || 0) / 60 + this.numericPeriod(period);

		return time || 0;
	},

	minutesFromDate(date, hourHeight = 0) {
		return date.getHours() * hourHeight + (date.getMinutes() / 60) * hourHeight;
	},

	dateFromStringTime(timeString, date) {
		const matched = timeString.match(/\d+/g);

		if (!matched) {
			return null;
		}

		const [hours, minutes] = matched;
		const d = new Date(date?.getTime() || Date.now());

		d.setHours(hours > 12 ? hours : Number(hours) + this.numericPeriod(timeString));
		d.setMinutes(/\d/.test(minutes) ? minutes : 0);

		return d;
	},

	availableTimeByRange({
		initialState = {
			minutes: 0,
			hours: 0,
		},
		step = 1,
		minHour = 0,
		maxHour = 24,
		skipCondition,
	}) {
		const rez = {
			dates: [],
			hours: [],
		};

		let ind = minHour || Math.ceil((initialState.hours + initialState.minutes / 60) / step) * step;

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

			rez.dates.push(date);
			rez.hours.push(ind);
			ind += step;
		}

		return rez;
	},

	allDaysOnMonth(date) {
		const d = new Date(date?.getTime() || Date.now());
		const year = d.getFullYear();
		const month = d.getMonth() + 1;

		const days = [];
		const lastMonth = 32
		- generateDate({
			year,
			month,
			day: 32,
		}).getDate();
		const firstWeekday = generateDate({
			year,
			month,
		}).getDay() + 1;

		let iterator = 1;
		let space = 1;
		while (space <= MAX_COUNT_WEEKDAYS * MAX_COUNT_WEEKS_IN_CALENDAR - 1) {
			if (space >= firstWeekday && lastMonth >= iterator) {
				days.push(iterator);

				iterator += 1;
			} else {
				days.push(false);
			}

			space += 1;
		}

		return days;
	},
};

export default formatDate;