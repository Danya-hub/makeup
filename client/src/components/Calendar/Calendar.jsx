/* eslint-disable react/prop-types */

import { memo, forwardRef } from "react";

import Navigation from "@/components/Calendar/Navigation/Navigation.jsx";
import Content from "@/components/Calendar/Content/Content.jsx";
import Weekday from "@/components/Calendar/Weekday/Weekday.jsx";

import style from "./Calendar.module.css";

function Calendar({ id = "", onChange, styleAttr = {}, options }, ref) {
	return (
		<div
			id={id}
			className={style.calendar}
			ref={ref}
			style={styleAttr}
		>
			<Navigation
				onChange={onChange}
				options={options}
			/>
			<table>
				<tbody>
					<Weekday />
					<Content
						onChange={onChange}
						options={options}
					/>
				</tbody>
			</table>
		</div>
	);
}

export default memo(forwardRef(Calendar));
