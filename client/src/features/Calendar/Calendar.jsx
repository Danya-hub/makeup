import { useEffect, memo, useRef } from "react";
import types from "prop-types";

import useDate from "@/hooks/date.js";

import Navigation from "@/features/Calendar/Navigation/Navigation.jsx";
import Content from "@/features/Calendar/Content/Content.jsx";
import Weekday from "@/features/Calendar/Weekday/Weekday.jsx";

import style from "./Calendar.module.css";

Calendar.propTypes = {
	id: types.string,
	onChange: types.func,
	styleAttr: types.object,
	date: types.object,
};

function Calendar({ id = "", onChange, styleAttr = {}, date }) {
	const isMounted = useRef(false);
	const [
		{
			memoDate,
			noChangeDate,
			month: [month, setMonth],
			day: [day, setDay],
		},
	] = useDate(date);

	useEffect(() => {
		if (onChange && isMounted.current) {
			onChange(memoDate);
		}

		isMounted.current = true;
	}, [month, day]);

	return (
		<div
			className={style.calendar}
			id={id}
			style={styleAttr}
		>
			<Navigation
				locale={memoDate}
				month={[month, setMonth]}
			></Navigation>
			<table>
				<tbody>
					<Weekday></Weekday>
					<Content
						noChangeDate={noChangeDate}
						locale={{
							month,
							day: [day, setDay],
							date: memoDate,
						}}
					></Content>
				</tbody>
			</table>
		</div>
	);
}

export default memo(Calendar);
