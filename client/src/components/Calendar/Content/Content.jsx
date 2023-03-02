import types from "prop-types";

import FormatDate, { MAX_COUNT_WEEKDAYS, MAX_COUNT_WEEKS_IN_CALENDAR } from "@/utils/formatDate.js";

import style from "./Content.module.css";

function Content({ options, onChange }) {
	const { dayState, monthState, locale, strictTimeObject } = options;

	const [day, setDay] = dayState;
	const [month] = monthState;

	const daysOfMonth = FormatDate.allDaysOnMonth(locale);

	function handleClick(d) {
		if (!d) {
			return;
		}

		setDay(d);
		onChange(locale);
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
							+ (strictTimeObject.current.day === row && strictTimeObject.current.month === month
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
