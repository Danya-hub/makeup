import { memo } from "react";
import types from "prop-types";

import useDate from "@/hooks/date.js";

import Navigation from "@/components/Calendar/Navigation/Navigation.jsx";
import Content from "@/components/Calendar/Content/Content.jsx";
import Weekday from "@/components/Calendar/Weekday/Weekday.jsx";

import style from "./Calendar.module.css";

Calendar.propTypes = {
	id: types.string,
	onChange: types.func,
	styleAttr: types.object,
	propDate: types.object,
};

function Calendar({ id = "", onChange, styleAttr = {}, propDate }) {
	const [{ _date, monthState, dayState }] = useDate(propDate);
	const options = {
		monthState,
		dayState,
		propDate,
		_date,
		onChange,
	};

	return (
		<div
			className={style.calendar}
			id={id}
			style={styleAttr}
		>
			<Navigation locale={options}></Navigation>
			<table>
				<tbody>
					<Weekday></Weekday>
					<Content locale={options}></Content>
				</tbody>
			</table>
		</div>
	);
}

export default memo(Calendar);
