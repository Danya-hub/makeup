import { useContext } from "react";
import types from "prop-types";
import { useSelector } from "react-redux";

import FormatDate from "@/utils/formatDate.js";
import ProcConfig from "@/config/procedures.js";
import LangContext from "@/context/lang.js";
import Value from "@/helpers/value.js";
import style from "./Diagram.module.css";

function Diagram({ hourHeightInPx }) {
	const [{
		currentLang,
	}] = useContext(LangContext);
	const { userProcedures } = useSelector((state) => state);

	const times = FormatDate.availableTimeByRange({
		minHour: ProcConfig.START_WORK_TIME,
		maxHour: ProcConfig.FINISH_WORK_TIME,
	});
	const formatedTimes = times.map((date) => (
		FormatDate.stringHourAndMin(
			date,
			currentLang,
		)
	));
	const widthCharTime = Value.charWidthInPixels(formatedTimes[formatedTimes.length - 1]);

	return (
		<div className={style.hours}>
			{formatedTimes.map((hour, i, arr) => (
				<div
					key={hour}
					className={style.cell}
					style={{
						height: hourHeightInPx,
						width: `${widthCharTime}px`,
					}}
				>
					<div
						className={style.line}
						style={{
							top: `${userProcedures.hourHeightInPx * i}px`,
						}}
					>
						<span
							style={{
								visibility: i === 0 || i === arr.length ? "hidden" : "",
							}}
						>
							{hour}
						</span>
					</div>
				</div>
			))}
		</div>
	);
}

Diagram.propTypes = {
	hourHeightInPx: types.number.isRequired,
};

export default Diagram;
