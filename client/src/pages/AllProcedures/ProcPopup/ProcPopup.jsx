import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import types from "prop-types";

import {
	actions as procedureCartActions,
	createNewProcedure,
} from "@/service/redusers/allProcedures.js";
import FormatDate from "@/utils/formatDate.js";

import Popup from "@/components/UI/Popup/Popup.jsx";
import Select from "@/components/Form/Select/Select.jsx";
import TimeInput from "@/pages/AllProcedures/ProcPopup/TimeInput/TimeInput.jsx";

import style_popup from "./ProcPopup.module.css";
import style_timeInput from "./TimeInput/TimeInput.module.css";

ProcPopup.propTypes = {
	warning: types.object,
	visibleState: types.array,
	newProcedureState: types.array,
	defaultValueProcedure: types.object,
	onTouchCart: types.func,
	onElapsedDay: types.func,
	onCrossingElapsedTime: types.func,
	setUnitForDate: types.func,
};

function ProcPopup({
	warning,
	visibleState,
	newProcedureState,
	defaultValueProcedure,
	onTouchCart,
	onElapsedDay,
	onCrossingElapsedTime,
	setUnitForDate,
}) {
	const dispatch = useDispatch();
	const { allProcedures } = useSelector((state) => state);
	const { t } = useTranslation();

	const { hasWarning } = warning;
	const [newProcedure, setNewProcedure] = newProcedureState;
	const [isVisible, setVisible] = visibleState;
	const [finedWarning, isFoundWarning] = hasWarning();

	const [isOpenSelectProcedure, setOpenSelectProcedure] = useState(false);
	const [isOpenCalendar, setOpenCalendar] = useState(false);

	function changeValue(object) {
		setNewProcedure((prev) => ({
			...prev,
			...object,
		}));
	}

	function handleSubmitForm(e) {
		e.preventDefault();

		if (isFoundWarning) {
			return;
		}

		dispatch(createNewProcedure(newProcedure));
		dispatch(procedureCartActions.addNewProcedure(newProcedure));

		setVisible(false);
	}

	function onCloseCalendar() {
		setOpenCalendar(false);
	}

	function onCloseSelectProcedure() {
		setOpenSelectProcedure(false);
	}

	return (
		<Popup
			id={style_popup.popupNewProc}
			onClose={() => setNewProcedure(defaultValueProcedure.current)}
			closeMethod="visible"
			eventsOnOutside={{
				onClick: {
					[style_timeInput.day]: isOpenCalendar ? onCloseCalendar : null,
					procedureName: isOpenSelectProcedure ? onCloseSelectProcedure : null,
				},
			}}
			strictSwitch={[
				isVisible,
				(bln) => {
					setVisible(bln);
				},
			]}
		>
			{isFoundWarning && (
				<div className={style_popup.warning}>
					<i
						className="fa fa-exclamation-circle"
						aria-hidden="true"
					></i>
					<p>{finedWarning}</p>
				</div>
			)}
			<form
				method=""
				onSubmit={handleSubmitForm}
			>
				<label
					className={style_popup.input}
					id="procedureName"
				>
					<h3 className="title">{t("procedure")}</h3>
					<Select
						defaultValue={newProcedure.type?.name}
						values={allProcedures.types.map((obj) => obj["name"])}
						onChange={(ind) => {
							const startProcMinutes =
								FormatDate.numericHoursFromDate(newProcedure.startProcTime) * 60;
							const finishProcMinutes =
								startProcMinutes + allProcedures.types[ind].durationProc * 60;

							changeValue({
								finishProcTime: FormatDate.minutesInDate(
									finishProcMinutes,
									newProcedure.finishProcTime,
									false
								),
								type: allProcedures.types[ind],
							});

							onTouchCart(startProcMinutes, finishProcMinutes);
						}}
						strictSwitch={[
							isOpenSelectProcedure,
							(bln) => {
								setOpenSelectProcedure(bln);
							},
						]}
						id="procedureName"
					></Select>
				</label>
				<TimeInput
					newProcedure={newProcedure}
					onTouchCart={onTouchCart}
					onElapsedDay={onElapsedDay}
					onCrossingElapsedTime={onCrossingElapsedTime}
					setUnitForDate={setUnitForDate}
					warning={warning}
					changeValue={changeValue}
					openCalendarState={[isOpenCalendar, setOpenCalendar]}
				></TimeInput>
				<button
					type="submit"
					id={style_popup.makeProc}
					className="button border"
					disabled={isFoundWarning}
				>
					{
						t("book", {
							returnObjects: true,
						}).short
					}
				</button>
			</form>
		</Popup>
	);
}

export { ProcPopup as default };
