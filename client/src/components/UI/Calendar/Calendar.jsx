/* eslint-disable react/prop-types */

import { memo, forwardRef } from "react";

import Navigation from "@/components/UI/Calendar/Navigation/Navigation.jsx";
import Content from "@/components/UI/Calendar/Content/Content.jsx";
import Weekday from "@/components/UI/Calendar/Weekday/Weekday.jsx";

import style from "./Calendar.module.css";

function Calendar({
	id = "",
	styleAttr = {},
	options,
	onChange,
}, ref) {
	return (
		<div
			id={id}
			className={style.calendar}
			ref={ref}
			style={styleAttr}
		>
			<Navigation
				options={options}
				onChange={onChange}
			/>
			<table>
				<tbody>
					<Weekday />
					<Content
						options={options}
						onChange={onChange}
					/>
				</tbody>
			</table>
		</div>
	);
}

export default memo(forwardRef(Calendar));
