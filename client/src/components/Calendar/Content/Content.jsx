import { Fragment } from "react";
import types from "prop-types";

import FormatDate, { MAX_COUNT_WEEKDAYS, MAX_COUNT_WEEKS_IN_CALENDAR } from "@/utils/formatDate.js";

import style from "./Content.module.css";

Content.propTypes = {
	monthState: types.array,
	dayState: types.array,
	locale: types.object,
	onChange: types.func,
	strictTimeObject: types.object,
};

function Content({ monthState, dayState, locale, onChange, strictTimeObject }) {
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
		<Fragment>
			{[...Array(MAX_COUNT_WEEKS_IN_CALENDAR)].map((_, i) => (
				<tr
					className={style.week}
					key={i + "/week"}
				>
					{daysOfMonth.slice(i * MAX_COUNT_WEEKDAYS, (i + 1) * MAX_COUNT_WEEKDAYS).map((d, j) => (
						<td
							key={d + "/" + j}
							className={
								(!d ? style.empty : "") +
								(strictTimeObject.current.day === d && strictTimeObject.current.month === month
									? style.current
									: "") +
								(day === d ? ` ${style.hover}` : "")
							}
							onClick={() => handleClick(d)}
						>
							<span>{d}</span>
						</td>
					))}
				</tr>
			))}
		</Fragment>
	);
}

export { Content as default };
