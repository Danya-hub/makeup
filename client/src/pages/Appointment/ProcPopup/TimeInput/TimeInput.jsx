import { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import types from "prop-types";

import LangContext from "@/context/lang.js";
import FormatDate from "@/utils/formatDate.js";
import useOutsideEvent from "@/hooks/useOutsideEvent.js";
import { actions } from "@/service/redusers/userProcedures.js";
import ProcConfig from "@/config/procedures.js";

import Calendar from "@/components/UI/Calendar/Calendar.jsx";
import Select from "@/components/UI/Form/Select/Select.jsx";

import style from "./TimeInput.module.css";

function TimeInput({ openCalendarState }) {
	const [{
		currentLang,
	}] = useContext(LangContext);
	const dispatch = useDispatch();
	const {
		locale,
		strictTimeObject,
		currentProcedure,
		availableDateTime,
		hourHeightInPx,
	} = useSelector((state) => state.userProcedures);

	const [isOpenSelectHours, setOpenSelectHours] = useState(false);

	const [procedure] = currentProcedure;
	const [isOpenCalendar, setOpenCalendar] = openCalendarState;
	const currentProcDate = FormatDate.minutesToDate(
		procedure.hour * hourHeightInPx,
		locale,
	);
	const formatedTimeCurrProc = FormatDate.stringHourAndMinWithRange(
		currentProcDate,
		procedure.type.duration,
		currentLang,
	);
	const weekdayAndMonth = FormatDate.weekdayAndMonth(currentProcDate, currentLang);
	const calendarOptions = {
		year: procedure.year,
		month: [procedure.month, (m) => dispatch(actions.switchMonth(m))],
		day: [procedure.day, (d) => dispatch(actions.switchDay(d))],
		locale,
		strictTimeObject,
	};
	const formatedAvailableTime = availableDateTime.map((date) => FormatDate.stringHourAndMin(
		date,
		currentLang,
	));

	function onCloseSelectHours() {
		setOpenSelectHours(false);
	}

	function onCloseCalendar() {
		setOpenCalendar(false);
	}

	const calendarRef = useOutsideEvent(onCloseCalendar);
	const hoursRef = useOutsideEvent(onCloseSelectHours);

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
				ref={hoursRef}
				id="startProcTime"
				values={formatedAvailableTime}
				defaultValue={formatedTimeCurrProc}
				onChange={setStartAndFinishTimes}
				openState={[
					isOpenSelectHours,
					(bln) => {
						setOpenSelectHours(bln);
					},
				]}
			/>
		</div>
	);
}

TimeInput.propTypes = {
	openCalendarState: types.instanceOf(Array).isRequired,
};

export default TimeInput;
