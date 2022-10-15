import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import types from "prop-types";

import {
	actions as procedureCartActions,
	createNewProcedure,
} from "@/service/redusers/procedure.js";
import FormatDate from "@/utils/formatDate.js";

import Popup from "@/components/UI/Popup/Popup.jsx";
import Select from "@/components/Form/Select/Select.jsx";
import TimeInput from "@/pages/Procedure/ProcPopup/TimeInput/TimeInput.jsx";

import style_popup from "./ProcPopup.module.css";
import style_timeInput from "./TimeInput/TimeInput.module.css";

ProcPopup.propTypes = {
	warning: types.object,
	isVisible: types.array,
	newProcedure: types.array,
	defaultValueProcedure: types.object,
	onTouchCart: types.func,
	onElapsedDay: types.func,
	onCrossingElapsedTime: types.func,
	setUnitForDate: types.func,
};

function ProcPopup({
	warning,
	isVisible,
	newProcedure,
	defaultValueProcedure,
	onTouchCart,
	onElapsedDay,
	onCrossingElapsedTime,
	setUnitForDate,
}) {
	const dispatch = useDispatch();
	const { procedure } = useSelector((state) => state);
	const { t } = useTranslation();

	const { hasWarning } = warning;
	const [_newProcedure, setNewProcedure] = newProcedure;
	const [_isVisible, setVisible] = isVisible;
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

		dispatch(createNewProcedure(_newProcedure));
		dispatch(procedureCartActions.addNewProcedure(_newProcedure));

		setVisible(false);
	}

	return (
		<Popup
			id={style_popup.popupNewProc}
			onClose={() => setNewProcedure(defaultValueProcedure.current)}
			closeMethod="visible"
			onOutside={{
				onClick: {
					[style_timeInput.day]: isOpenCalendar
						? () => {
								setOpenCalendar(false);
						  }
						: null,
					procedureName: isOpenSelectProcedure
						? () => {
								setOpenSelectProcedure(false);
						  }
						: null,
				},
			}}
			strictSwitch={[
				_isVisible,
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
						defaultValue={_newProcedure.type?.name}
						values={procedure.types.map((obj) => obj["name"])}
						onChange={(ind) => {
							const startProcMinutes =
								FormatDate.numericHoursFromDate(_newProcedure.startProcTime) * 60;
							const finishProcMinutes = startProcMinutes + procedure.types[ind].durationProc * 60;

							changeValue({
								finishProcTime: FormatDate.minutesInDate(
									finishProcMinutes,
									_newProcedure.finishProcTime,
									false
								),
								type: procedure.types[ind],
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
					newProcedure={_newProcedure}
					onTouchCart={onTouchCart}
					onElapsedDay={onElapsedDay}
					onCrossingElapsedTime={onCrossingElapsedTime}
					setUnitForDate={setUnitForDate}
					warning={warning}
					changeValue={changeValue}
					isOpenCalendar={[isOpenCalendar, setOpenCalendar]}
				></TimeInput>
				<button
					type="submit"
					id={style_popup.makeProc}
					className="button"
					disabled={isFoundWarning}
				>
					{t("save")}
				</button>
			</form>
		</Popup>
	);
}

export { ProcPopup as default };
