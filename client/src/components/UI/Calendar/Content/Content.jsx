import types from "prop-types";

import DateFormatter, { MAX_COUNT_WEEKDAYS, MAX_COUNT_WEEKS_IN_CALENDAR } from "@/utils/dateFormatter.js";

import style from "./Content.module.css";

function Content({ options, onChange }) {
	const {
		month,
		day,
		year,
		setDay,
		locale,
		strictTimeObject,
	} = options;
	const daysOfMonth = DateFormatter.allDaysInMonth(locale.getYear(), locale.getMonth() - 1);

	function handleClick(d) {
		if (!d) {
			return;
		}

		onChange(
			new Date(year, month, d),
			() => setDay(d),
		);
	}

	return (
		<>
			{[...Array(MAX_COUNT_WEEKS_IN_CALENDAR)].map((_, i) => (
				<tr
					className={style.week}
					key={`${MAX_COUNT_WEEKS_IN_CALENDAR - i}/column`}
				>
					{daysOfMonth.slice(i * MAX_COUNT_WEEKDAYS, (i + 1) * MAX_COUNT_WEEKDAYS).map((row, j) => {
						const className = (!row ? style.empty : "")
							+ (strictTimeObject.day === row && strictTimeObject.month === month
								? style.current
								: "")
							+ (day === row ? ` ${style.hover}` : "");

						return (
							<td key={`${i * MAX_COUNT_WEEKDAYS + j}/row`}>
								<button
									type="button"
									className={className}
									onClick={() => handleClick(row)}
								>
									{row}
								</button>
							</td>
						);
					})}
				</tr>
			))}
		</>
	);
}

Content.propTypes = {
	options: types.instanceOf(Object).isRequired,
	onChange: types.func.isRequired,
};

export default Content;
