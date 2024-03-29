import { useContext, memo, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import types from "prop-types";

import GlobalContext from "@/context/global.js";
import DateFormatter from "@/utils/dateFormatter.js";
import useOutsideEvent from "@/hooks/useOutsideEvent.js";
import {
	actions as appointmentsActions,
	asyncActions as appointmentsAsyncActions,
} from "@/service/redusers/appointments.js";
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
	} = useSelector((state) => state.appointments);

	const [procedure] = currentProcedure;
	const currentProcDate = DateFormatter.minutesToDate(
		procedure.hour * hourHeightInPx,
		locale,
	);
	const formatedTimeCurrProc = DateFormatter.stringHourRange(
		currentProcDate,
		procedure.type.duration,
		currentLang,
	);
	const weekdayAndMonth = DateFormatter.weekdayAndMonth(
		currentProcDate,
		currentLang,
	);
	const formatedAvailableTime = availableDateTime.map(
		(date) => DateFormatter.stringHourAndMin(
			date,
			currentLang,
		),
	);

	const calendarOptions = useMemo(() => ({
		year: procedure.year,
		month: procedure.month,
		setMonth: (m) => dispatch(appointmentsActions.switchMonth(m)),
		day: procedure.day,
		setDay: (d) => dispatch(appointmentsActions.switchDay(d)),
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
		const time = DateFormatter.numericTimeFromChar(finalValue) - ProcConfig.START_WORK_TIME;

		dispatch(appointmentsActions.changeHour(time));

		const scrollYInPx = time * hourHeightInPx;
		window.scrollTo(0, scrollYInPx);
	}

	function handleChangeCalendar(date, onSuccess) {
		dispatch(appointmentsAsyncActions.getProcedureByDay(date))
			.then(onSuccess);
		setOpenCalendar(false);
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
						onChange={handleChangeCalendar}
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
