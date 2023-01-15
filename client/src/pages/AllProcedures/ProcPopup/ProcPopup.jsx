import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import types from "prop-types";

import { createNewProcedure } from "@/service/redusers/procedures.js";
import FormatDate from "@/utils/formatDate.js";
import useOutsideEvent from "@/hooks/useOutsideEvent";
import changePropertyValue from "@/helpers/changePropertyValue.js";

import Popup from "@/components/UI/Popup/Popup.jsx";
import Select from "@/components/UI/Form/Select/Select.jsx";
import Warning from "@/components/UI/Form/Message/Warning/Warning.jsx";
import TimeInput from "@/pages/AllProcedures/ProcPopup/TimeInput/TimeInput.jsx";

import style from "./ProcPopup.module.css";

ProcPopup.propTypes = {
	warning: types.object,
	visibleState: types.array,
	viewState: types.object,
	newProcedureState: types.array,
	defaultValueProcedure: types.object,
	onTouchCard: types.func,
	onCrossingElapsedTime: types.func,
	handleChangeDate: types.func,
};

function ProcPopup({
	warning,
	visibleState,
	viewState,
	newProcedureState,
	defaultValueProcedure,
	onTouchCard,
	onCrossingElapsedTime,
	handleChangeDate,
}) {
	const dispatch = useDispatch();
	const { procedures } = useSelector((state) => state);
	const { t } = useTranslation();
	const ref = useOutsideEvent(onCloseSelectProcedure);

	const { hasWarning } = warning;
	const [newProcedure, setNewProcedure] = newProcedureState;
	const [isVisible, setVisible] = visibleState;
	const [finedWarningText, isFoundWarning] = hasWarning();

	const [isOpenSelectProcedure, setOpenSelectProcedure] = useState(false);
	const [isOpenCalendar, setOpenCalendar] = useState(false);

	function handleSubmitForm(e) {
		e.preventDefault();

		if (isFoundWarning) {
			return;
		}

		dispatch(createNewProcedure(newProcedure));

		setVisible(false);
	}

	function onCloseSelectProcedure() {
		setOpenSelectProcedure(false);
	}

	return (
		<Popup
			id={style.popupNewProc}
			onClose={() => setNewProcedure(defaultValueProcedure.current)}
			isSimple={false}
			strictSwitch={[
				isVisible,
				(bln) => {
					setVisible(bln);
				},
			]}
		>
			{isFoundWarning && <Warning text={finedWarningText}></Warning>}
			<form onSubmit={handleSubmitForm}>
				<label
					className={style.input}
					id="procedureName"
				>
					<h3 className="title">{t("procedure")}</h3>
					<Select
						ref={ref}
						defaultValue={newProcedure.type?.name}
						values={procedures.types.map((obj) => obj["name"])}
						onChange={(ind) => {
							const startProcMinutes =
								FormatDate.numericHoursFromDate(newProcedure.startProcTime) * 60;
							const finishProcMinutes = startProcMinutes + procedures.types[ind].durationProc * 60;

							changePropertyValue(
								{
									finishProcTime: FormatDate.minutesToDate(
										finishProcMinutes,
										newProcedure.finishProcTime,
										false
									),
									type: procedures.types[ind],
								},
								setNewProcedure
							);

							onTouchCard(startProcMinutes, finishProcMinutes);
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
					onTouchCard={onTouchCard}
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
