import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import Popup from "@/components/UI/Popup/Popup.jsx";
import Select from "@/components/UI/Form/Select/Select.jsx";
import Notification from "@/components/UI/Form/Notification/Notification.jsx";
import TimeInput from "@/pages/AllProcedures/ProcPopup/TimeInput/TimeInput.jsx";

import PropsContext from "@/pages/AllProcedures/context.js";
import FormatDate from "@/utils/formatDate.js";
import useOutsideEvent from "@/hooks/useOutsideEvent";
import { MAX_COUNT_PROCEDURE } from "@/pages/AllProcedures/constants.js";

import style from "./Make.module.css";

function MakeProc() {
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
	const { procedures } = useSelector((state) => state);

	const [newProcedures, setNewProcedure] = newProceduresState;
	const [[currProcedure, indexSelectedProcedure], setCurrProcedure] = currProcedureState;
	const { checkOnWarning } = warning;
	const [isVisible, setVisible] = visiblePopupState;
	const [, changePopupName] = changePopupNameState;
	const [foundWarningText, hasWarning] = checkOnWarning();

	const [isOpenSelectProcedure, setOpenSelectProcedure] = useState(false);
	const [isOpenCalendar, setOpenCalendar] = useState(false);

	function onCloseSelectProcedure() {
		setOpenSelectProcedure(false);
	}

	const ref = useOutsideEvent(onCloseSelectProcedure);

	function handleSubmitForm(e) {
		e.preventDefault();

		if (hasWarning || MAX_COUNT_PROCEDURE <= newProcedures.length) {
			return;
		}

		if (newProcedures[indexSelectedProcedure]) {
			setNewProcedure((prev) => {
				const array = [...prev];

				array[indexSelectedProcedure][1] = false;

				return array;
			});
		} else {
			setNewProcedure((prev) => [...prev, [currProcedure, false, newProcedures.length]]);
		}

		setCurrProcedure([defaultValueProcedure.current, newProcedures.length + 1]);
		changePopupName("design");
	}

	function handleChangeProcName(ind) {
		const startProcMinutes = FormatDate.numericHoursFromDate(currProcedure.startProcTime) * 60;
		const finishProcMinutes = startProcMinutes + procedures.types[ind].durationProc * 60;

		setCurrProcedure((prev) => {
			const array = [...prev];

			array[0] = {
				...array[0],
				finishProcTime: FormatDate.minutesToDate(
					finishProcMinutes,
					currProcedure.finishProcTime,
					false,
				),
				type: procedures.types[ind],
			};

			return array;
		});

		onTouchCard(startProcMinutes, finishProcMinutes);
	}

	function handleChangeTime(options) {
		setCurrProcedure((prev) => {
			const array = [...prev];

			array[0] = {
				...array[0],
				...options,
			};

			return array;
		});
	}

	function onClose() {
		setCurrProcedure([defaultValueProcedure.current, newProcedures.length]);

		if (!newProcedures[indexSelectedProcedure]) {
			return;
		}

		setNewProcedure((prev) => {
			const array = [...prev];

			array[indexSelectedProcedure][1] = false;

			return array;
		});
	}

	return (
		<Popup
			id={style.makeProc}
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
				/>
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
						values={procedures.types.map((obj) => obj.name)}
						onChange={handleChangeProcName}
						openState={[
							isOpenSelectProcedure,
							(bln) => {
								setOpenSelectProcedure(bln);
							},
						]}
						id="procedureName"
					/>
				</div>
				<div id="time">
					<h3 className={style.title}>{t("time")}</h3>
					<TimeInput
						newProceduresState={[currProcedure, handleChangeTime]}
						openCalendarState={[isOpenCalendar, setOpenCalendar]}
					/>
				</div>
				<div className={style.buttons}>
					<button
						type="submit"
						id={style.add}
						className="button border"
					>
						{t("add")}
					</button>
					<button
						type="button"
						id={style.design}
						className="button border"
						onClick={() => changePopupName("design")}
						disabled={hasWarning || !newProcedures.length}
					>
						{t("design")}
					</button>
				</div>
			</form>
		</Popup>
	);
}

export default MakeProc;
