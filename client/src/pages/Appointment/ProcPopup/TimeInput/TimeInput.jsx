import { useContext, memo, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import types from "prop-types";

import GlobalContext from "@/context/global.js";
import FormatDate from "@/utils/formatDate.js";
import useOutsideEvent from "@/hooks/useOutsideEvent.js";
import { actions } from "@/service/redusers/userProcedures.js";
import ProcConfig from "@/config/procedures.js";

import Calendar from "@/components/UI/Calendar/Calendar.jsx";
import Select from "@/components/UI/Form/Select/Select.jsx";

import style from "./TimeInput.module.css";

function TimeInput({
	isOpenCalendar,
	setOpenCalendar,
}) {
	const {
		currentLang,
	} = useContext(GlobalContext);
	const dispatch = useDispatch();
	const {
		locale,
		strictTimeObject,
		currentProcedure,
		availableDateTime,
		hourHeightInPx,
	} = useSelector((state) => state.userProcedures);

	const [procedure] = currentProcedure;
	const currentProcDate = FormatDate.minutesToDate(
		procedure.hour * hourHeightInPx,
		locale,
	);
	const formatedTimeCurrProc = FormatDate.stringHourAndMinWithRange(
		currentProcDate,
		procedure.type.duration,
		currentLang,
	);
	const weekdayAndMonth = FormatDate.weekdayAndMonth(
		currentProcDate,
		currentLang,
	);
	const formatedAvailableTime = availableDateTime.map(
		(date) => FormatDate.stringHourAndMin(
			date,
			currentLang,
		),
	);
	const calendarOptions = useMemo(() => ({
		year: procedure.year,
		month: procedure.month,
		setMonth: (m) => dispatch(actions.switchMonth(m)),
		day: procedure.day,
		setDay: (d) => dispatch(actions.switchDay(d)),
		locale,
		strictTimeObject,
	}), [procedure]);

	function onCloseCalendar() {
		setOpenCalendar(false);
	}

	const calendarRef = useOutsideEvent(onCloseCalendar);

	function handleSwitchCalendarVisState() {
		setOpenCalendar((isOpen) => !isOpen);
	}

	function setStartAndFinishTimes(_, finalValue) {
		const time = FormatDate.numericTimeFromChar(finalValue) - ProcConfig.START_WORK_TIME;

		dispatch(actions.changeHour(time));

		const scrollYInPx = time * hourHeightInPx;
		window.scrollTo(0, scrollYInPx);
	}

	return (
		<div
			id={style.time}
			className={style.input}
		>
			<i
				className="fa fa-clock-o"
				aria-hidden="true"
			/>
			<div
				ref={calendarRef}
				id={style.day}
			>
				<button
					type="button"
					onClick={handleSwitchCalendarVisState}
				>
					{weekdayAndMonth}
				</button>
				{isOpenCalendar && (
					<Calendar
						id={style.dayAndMonthCalendar}
						options={calendarOptions}
					/>
				)}
			</div>
			<Select
				id="startProcTime"
				values={formatedAvailableTime}
				defaultValue={formatedTimeCurrProc}
				onChange={setStartAndFinishTimes}
			/>
		</div>
	);
}

TimeInput.propTypes = {
	isOpenCalendar: types.bool.isRequired,
	setOpenCalendar: types.func.isRequired,
};

export default memo(TimeInput);
