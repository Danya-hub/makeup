import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import types from "prop-types";

import {
	actions as procedureCartActions,
	createNewProcedure,
} from "@/service/redusers/allProcedures.js";
import FormatDate from "@/utils/formatDate.js";
import useOutsideEvent from "@/hooks/useOutsideEvent";

import Popup from "@/components/UI/Popup/Popup.jsx";
import Select from "@/components/UI/Form/Select/Select.jsx";
import TimeInput from "@/pages/AllProcedures/ProcPopup/TimeInput/TimeInput.jsx";

import style from "./ProcPopup.module.css";

ProcPopup.propTypes = {
	warning: types.object,
	visibleState: types.array,
	viewState: types.object,
	newProcedureState: types.array,
	defaultValueProcedure: types.object,
	onTouchCart: types.func,
	onCrossingElapsedTime: types.func,
	handleChangeDate: types.func,
};

function ProcPopup({
	warning,
	visibleState,
	viewState,
	newProcedureState,
	defaultValueProcedure,
	onTouchCart,
	onCrossingElapsedTime,
	handleChangeDate,
}) {
	const dispatch = useDispatch();
	const { allProcedures } = useSelector((state) => state);
	const { t } = useTranslation();
	const ref = useOutsideEvent(onCloseSelectProcedure);

	const { hasWarning } = warning;
	const [newProcedure, setNewProcedure] = newProcedureState;
	const [isVisible, setVisible] = visibleState;
	const [finedWarning, isFoundWarning] = hasWarning();

	const [isOpenSelectProcedure, setOpenSelectProcedure] = useState(false);
	const [isOpenCalendar, setOpenCalendar] = useState(false);

	function handleSubmitForm(e) {
		e.preventDefault();

		if (isFoundWarning) {
			return;
		}

		dispatch(createNewProcedure(newProcedure));
		dispatch(procedureCartActions.addNewProcedure(newProcedure));

		setVisible(false);
	}

	function onCloseSelectProcedure() {
		setOpenSelectProcedure(false);
	}

	return (
		<Popup
			id={style.popupNewProc}
			onClose={() => setNewProcedure(defaultValueProcedure.current)}
			closeMethod="visible"
			strictSwitch={[
				isVisible,
				(bln) => {
					setVisible(bln);
				},
			]}
		>
			{isFoundWarning && (
				<div className={style.warning}>
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
					className={style.input}
					id="procedureName"
				>
					<h3 className="title">{t("procedure")}</h3>
					<Select
						ref={ref}
						defaultValue={newProcedure.type?.name}
						values={allProcedures.types.map((obj) => obj["name"])}
						onChange={(ind) => {
							const startProcMinutes =
								FormatDate.numericHoursFromDate(newProcedure.startProcTime) * 60;
							const finishProcMinutes =
								startProcMinutes + allProcedures.types[ind].durationProc * 60;

							setNewProcedure((prev) => ({
								...prev,
								finishProcTime: FormatDate.minutesInDate(
									finishProcMinutes,
									newProcedure.finishProcTime,
									false
								),
								type: allProcedures.types[ind],
							}));

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
					viewState={viewState}
					newProcedureState={newProcedureState}
					onTouchCart={onTouchCart}
					onCrossingElapsedTime={onCrossingElapsedTime}
					warning={warning}
					onChange={handleChangeDate}
					openCalendarState={[isOpenCalendar, setOpenCalendar]}
				></TimeInput>
				<button
					type="submit"
					id={style.makeProc}
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
