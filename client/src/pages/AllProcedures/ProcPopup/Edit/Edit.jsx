import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import Popup from "@/components/UI/Popup/Popup.jsx";
import Select from "@/components/UI/Form/Select/Select.jsx";
import TimeInput from "@/pages/AllProcedures/ProcPopup/TimeInput/TimeInput.jsx";
import Notification from "@/components/UI/Form/Notification/Notification.jsx";

import PropsContext from "@/pages/AllProcedures/context.js";
import FormatDate from "@/utils/formatDate.js";
import useOutsideEvent from "@/hooks/useOutsideEvent";

import style from "./Edit.module.css";

function EditProc() {
	const {
		warning,
		visiblePopupState,
		newProceduresState,
		currProcedureState,
		defaultValueProcedure,
		onTouchCard,
		changePopupNameState,
	} = useContext(PropsContext);
	const { t } = useTranslation();
	const ref = useOutsideEvent(onCloseSelectProcedure);
	const { procedures } = useSelector((state) => state);

	const [newProcedures, setNewProcedure] = newProceduresState;
	const [[currProcedure, indexSelectedProcedure], setCurrProcedure] = currProcedureState;
	const [isVisible, setVisible] = visiblePopupState;
	const [, changePopupName] = changePopupNameState;
	const { checkOnWarning } = warning;
	const [foundWarningText, hasWarning] = checkOnWarning();

	const [isOpenSelectProcedure, setOpenSelectProcedure] = useState(false);
	const [isOpenCalendar, setOpenCalendar] = useState(false);

	function handleSubmitForm(e) {
		e.preventDefault();

		setCurrProcedure([defaultValueProcedure.current, newProcedures.length]);
		setNewProcedure((prev) => {
			prev[indexSelectedProcedure] = [currProcedure, false, indexSelectedProcedure];

			return [...prev];
		});
		changePopupName("make");
	}

	function handleCancel() {
		setCurrProcedure(newProcedures[indexSelectedProcedure]);
		setNewProcedure((prev) => {
			prev[indexSelectedProcedure][1] = false;

			return [...prev];
		});
		changePopupName("make");
	}

	function onCloseSelectProcedure() {
		setOpenSelectProcedure(false);
	}

	function handleChangeProcName(ind) {
		const startProcMinutes = FormatDate.numericHoursFromDate(currProcedure.startProcTime) * 60;
		const finishProcMinutes = startProcMinutes + procedures.types[ind].durationProc * 60;

		setCurrProcedure((prev) => {
			prev[0] = {
				...prev[0],
				finishProcTime: FormatDate.minutesToDate(
					finishProcMinutes,
					currProcedure.finishProcTime,
					false
				),
				type: procedures.types[ind],
			};

			return [...prev];
		});

		onTouchCard(startProcMinutes, finishProcMinutes);
	}

	function onClose() {
		setCurrProcedure([defaultValueProcedure.current, newProcedures.length]);

		if (!newProcedures[indexSelectedProcedure]) {
			return;
		}

		setNewProcedure((prev) => {
			prev[indexSelectedProcedure][1] = false;

			return [...prev];
		});
	}

	return (
		<Popup
			id={style.editProc}
			onClose={onClose}
			isSimple={false}
			strictSwitch={[
				isVisible,
				(bln) => {
					setVisible(bln);
				},
			]}
		>
			{hasWarning && (
				<Notification
					status="warning"
					text={foundWarningText}
				></Notification>
			)}
			<form onSubmit={handleSubmitForm}>
				<div
					className={style.input}
					id="procedureName"
				>
					<h3 className={style.title}>{t("procedure")}</h3>
					<Select
						ref={ref}
						defaultValue={currProcedure.type?.name}
						values={procedures.types.map((obj) => obj["name"])}
						onChange={handleChangeProcName}
						strictSwitch={[
							isOpenSelectProcedure,
							(bln) => {
								setOpenSelectProcedure(bln);
							},
						]}
						id="procedureName"
					></Select>
				</div>
				<div id="time">
					<h3 className={style.title}>{t("time")}</h3>
					<TimeInput
						newProceduresState={[
							currProcedure,
							(props) => {
								setCurrProcedure((prev) => {
									prev[0] = {
										...prev[0],
										...props,
									};

									return [...prev];
								});
							},
						]}
						openCalendarState={[isOpenCalendar, setOpenCalendar]}
					></TimeInput>
				</div>
				<div className={style.buttons}>
					<button
						id={style.cancel}
						onClick={handleCancel}
						className="button border"
					>
						{t("cancel")}
					</button>
					<button
						type="submit"
						id={style.edit}
						className="button border"
						disabled={hasWarning}
					>
						{t("change")}
					</button>
				</div>
			</form>
		</Popup>
	);
}

export { EditProc as default };
