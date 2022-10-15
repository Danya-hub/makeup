import { Fragment, useEffect } from "react";
import types from "prop-types";

import FormatDate from "@/utils/formatDate.js";
import { MAX_COUNT_WEEKDAYS, MAX_COUNT_WEEKS_IN_CALENDAR } from "@/constants/calendar.js";

import style from "./Content.module.css";

Content.propTypes = {
	locale: types.object,
	noChangeDate: types.object,
};

function Content({ locale, noChangeDate }) {
	const { month, day, date } = locale;
	const [_day, setDay] = day;

	const daysOfMonth = FormatDate.allDaysOnMonth(date);

	useEffect(() => {
		setDay(date.getDate());
	}, [date]);

	return (
		<Fragment>
			{[...Array(MAX_COUNT_WEEKS_IN_CALENDAR)].map((_und, i) => (
				<tr key={i + "/weekday"}>
					{daysOfMonth.slice(i * MAX_COUNT_WEEKDAYS, (i + 1) * MAX_COUNT_WEEKDAYS).map((d, j) => (
						<td
							key={d + "/" + j}
							className={
								(!d ? style.empty : "") +
								(noChangeDate.current.day === d && noChangeDate.current.month === month
									? style.current
									: "") +
								(_day === d ? ` ${style.hover}` : "")
							}
							onClick={() => {
								if (!d) {
									return;
								}

								setDay(d);
								date.setDate(d);
							}}
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
