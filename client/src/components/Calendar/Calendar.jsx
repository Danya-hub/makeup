/* eslint-disable react/prop-types */

import { memo, forwardRef } from "react";

import Navigation from "@/components/Calendar/Navigation/Navigation.jsx";
import Content from "@/components/Calendar/Content/Content.jsx";
import Weekday from "@/components/Calendar/Weekday/Weekday.jsx";

import style from "./Calendar.module.css";

function Calendar({ id = "", onChange, styleAttr = {}, options }, ref) {
	const _opt = {
		...options,
		onChange,
	};

	return (
		<div
			id={id}
			className={style.calendar}
			ref={ref}
			style={styleAttr}
		>
			<Navigation {..._opt}></Navigation>
			<table>
				<tbody>
					<Weekday></Weekday>
					<Content {..._opt}></Content>
				</tbody>
			</table>
		</div>
	);
}

export default memo(forwardRef(Calendar));
