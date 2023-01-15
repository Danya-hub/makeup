import { useSelector } from "react-redux";
import types from "prop-types";

import FormatDate from "@/utils/formatDate.js";
import useOutsideEvent from "@/hooks/useOutsideEvent";
import changePropertyValue from "@/helpers/changePropertyValue";

import Calendar from "@/components/Calendar/Calendar.jsx";
import WidthInput from "@/components/UI/Form/WidthInput/WidthInput.jsx";

import style from "./TimeInput.module.css";

TimeInput.propTypes = {
	newProcedureState: types.array,
	warning: types.object,
	openCalendarState: types.array,
	onTouchCard: types.func,
	onCrossingElapsedTime: types.func,
	onChange: types.func,
	viewState: types.object,
};

function TimeInput({
	newProcedureState,
	warning,
	openCalendarState,
	onChange,
	onTouchCard,
	onCrossingElapsedTime,
	viewState,
}) {
	const { currLng } = useSelector((state) => state.langs);
	const ref = useOutsideEvent(onCloseCalendar);

	const [newProcedure, setNewProcedure] = newProcedureState;
	const [isOpenCalendar, setOpenCalendar] = openCalendarState;
	const { warnings, hasWarning: hasWarningFunc } = warning;
	const [, hasWarning] = hasWarningFunc();

	function onCloseCalendar() {
		setOpenCalendar(false);
	}

	function setStartAndFinishTimes(_, finalValue) {
		const time = FormatDate.numericTimeFromChar(finalValue);
		const finishMinutes = time * 60 + newProcedure.type.durationProc * 60;

		const startProcTime = FormatDate.minutesToDate(time * 60, newProcedure.startProcTime, false),
			finishProcTime = FormatDate.minutesToDate(finishMinutes, newProcedure.finishProcTime, false);

		changePropertyValue(
			{
				startProcTime,
				finishProcTime,
			},
			setNewProcedure
		);

		onCrossingElapsedTime(time * 60);
		onTouchCard(startProcTime, finishMinutes);
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
						ref={ref}
						options={viewState}
						onChange={onChange}
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
