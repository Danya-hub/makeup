import { Fragment } from "react";
import types from "prop-types";

import FormatDate from "@/utils/formatDate.js";
import { MAX_COUNT_WEEKDAYS, MAX_COUNT_WEEKS_IN_CALENDAR } from "@/constants/calendar.js";

import style from "./Content.module.css";

Content.propTypes = {
	locale: types.object,
	_date: types.object,
};

function Content({ locale }) {
	const { monthState, dayState, propDate, onChange, _date } = locale;
	const [day, setDay] = dayState;
	const [month] = monthState;

	const daysOfMonth = FormatDate.allDaysOnMonth(propDate);

	function handleClick(d) {
		if (!d) {
			return;
		}

		setDay(d);
		onChange(propDate);
	}

	return (
		<Fragment>
			{[...Array(MAX_COUNT_WEEKS_IN_CALENDAR)].map((_, i) => (
				<tr key={i + "/weekday"}>
					{daysOfMonth.slice(i * MAX_COUNT_WEEKDAYS, (i + 1) * MAX_COUNT_WEEKDAYS).map((d, j) => (
						<td
							key={d + "/" + j}
							className={
								(!d ? style.empty : "") +
								(_date.current.day === d && _date.current.month === month ? style.current : "") +
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
