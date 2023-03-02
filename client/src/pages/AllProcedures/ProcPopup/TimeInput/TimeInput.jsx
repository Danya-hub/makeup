import { useContext, useState } from "react";
import { useSelector } from "react-redux";
import types from "prop-types";

import FormatDate from "@/utils/formatDate.js";
import useOutsideEvent from "@/hooks/useOutsideEvent.js";
import PropsContext from "@/pages/AllProcedures/context.js";

import Calendar from "@/components/Calendar/Calendar.jsx";
import Select from "@/components/UI/Form/Select/Select.jsx";

import style from "./TimeInput.module.css";

function TimeInput({ newProceduresState, openCalendarState }) {
	const {
		warning,
		onChange,
		onTouchCard,
		onCrossingElapsedTime,
		viewState,
		selectTimeState,
		minHour,
		dragStep,
	} = useContext(PropsContext);
	const { currLng } = useSelector((state) => state.langs);
	const [isOpenSelectHours, setOpenSelectHours] = useState(false);

	const [newProcedure, setNewProcedure] = newProceduresState;
	const [isOpenCalendar, setOpenCalendar] = openCalendarState;
	const { warnings, checkOnWarning } = warning;
	const [, setSelectTime] = selectTimeState;
	const [, hasWarning] = checkOnWarning();
	const weekdayAndMonth = FormatDate.weekdayAndMonth(newProcedure.startProcTime, currLng);
	const arrayAllowTimes = FormatDate.hoursByFormat({
		hourFormat: currLng,
		initialState: {
			hours: 0,
			minutes: minHour * 60,
		},
		step: dragStep,
	});
	const stringHourAndMin = FormatDate.stringHourAndMin(newProcedure.startProcTime, currLng);

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
		const time = FormatDate.numericTimeFromChar(finalValue);
		const finishMinutes = time * 60 + newProcedure.type.durationProc * 60;

		const startProcTime = FormatDate.minutesToDate(time * 60, newProcedure.startProcTime, false);
		const finishProcTime = FormatDate
			.minutesToDate(finishMinutes, newProcedure.finishProcTime, false);

		setNewProcedure({
			startProcTime,
			finishProcTime,
		});

		onCrossingElapsedTime(time * 60);
		onTouchCard(startProcTime, finishMinutes);

		setSelectTime(time);
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
				className={warnings.elapsedDay ? style.warning : ""}
			>
				<button
					type="button"
					className={hasWarning ? style.warning : ""}
					onClick={handleSwitchCalendarVisState}
				>
					{weekdayAndMonth}
				</button>
				{isOpenCalendar && (
					<Calendar
						id={style.dayAndMonthCalendar}
						options={viewState}
						onChange={onChange}
					/>
				)}
			</div>
			<Select
				ref={hoursRef}
				id="startProcTime"
				className={hasWarning ? style.warning : ""}
				values={arrayAllowTimes}
				defaultValue={stringHourAndMin}
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
	newProceduresState: types.instanceOf(Array).isRequired,
	openCalendarState: types.instanceOf(Array).isRequired,
};

export default TimeInput;
