import { useSelector } from "react-redux";
import types from "prop-types";

import FormatDate from "@/utils/formatDate.js";

import Calendar from "@/components/Calendar/Calendar.jsx";
import WidthInput from "@/components/Form/WidthInput/WidthInput.jsx";

import style from "./TimeInput.module.css";

TimeInput.propTypes = {
	newProcedure: types.object,
	warning: types.object,
	changeValue: types.func,
	openCalendarState: types.array,
	setUnitForDate: types.func,
	onTouchCart: types.func,
	onElapsedDay: types.func,
	onCrossingElapsedTime: types.func,
};

function TimeInput({
	newProcedure,
	warning,
	changeValue,
	openCalendarState,
	setUnitForDate,
	onTouchCart,
	onElapsedDay,
	onCrossingElapsedTime,
}) {
	const { currLng } = useSelector((state) => state.langs);

	const { warnings, hasWarning: hasWarningFunc } = warning;
	const [, hasWarning] = hasWarningFunc();

	const [isOpenCalendar, setOpenCalendar] = openCalendarState;

	function setStartAndFinishTimes(finalValue) {
		const time = FormatDate.numericTimeFromChar(finalValue);
		const startProcTime = time * 60,
			finishProcMinutes = startProcTime + newProcedure.type.durationProc * 60;

		changeValue({
			startProcTime: FormatDate.minutesInDate(startProcTime, newProcedure.startProcTime, false),
			finishProcTime: FormatDate.minutesInDate(
				finishProcMinutes,
				newProcedure.finishProcTime,
				false
			),
		});

		onCrossingElapsedTime(startProcTime);
		onTouchCart(startProcTime, finishProcMinutes);
	}

	return (
		<div
			className={style.input}
			id={style.time}
		>
			<i
				className="fa fa-clock-o"
				aria-hidden="true"
			></i>
			<div
				id={style.day}
				className={warnings.elapsedDay ? style.warning : ""}
			>
				<WidthInput
					name="day"
					onClick={() => setOpenCalendar(true)}
					value={FormatDate.weekdayAndMonth(newProcedure.startProcTime, currLng)}
				/>
				{isOpenCalendar && (
					<Calendar
						id={style.dayAndMonthCalendar}
						propDate={newProcedure.startProcTime}
						onChange={(date) => {
							changeValue(
								setUnitForDate(["Month", "Date"], ["startProcTime", "finishProcTime"], date)
							);

							onElapsedDay(date);
						}}
					></Calendar>
				)}
			</div>
			<div className={hasWarning ? style.warning : ""}>
				<WidthInput
					name="startProcTime"
					id="startProcTime"
					value={FormatDate.stringHourAndMin(newProcedure.startProcTime, currLng)}
					onChange={setStartAndFinishTimes}
				/>
				<span>—</span>
				<WidthInput
					name="finishProcTime"
					id="finishProcTime"
					value={FormatDate.stringHourAndMin(newProcedure.finishProcTime, currLng)}
					disabled
				/>
			</div>
		</div>
	);
}

export { TimeInput as default };
