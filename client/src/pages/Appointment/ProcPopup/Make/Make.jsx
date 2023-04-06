import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

import Popup from "@/components/UI/Popup/Popup.jsx";
import Select from "@/components/UI/Form/Select/Select.jsx";
import Checkbox from "@/components/UI/Form/Checkbox/Checkbox.jsx";
import TimeInput from "@/pages/Appointment/ProcPopup/TimeInput/TimeInput.jsx";

import PropsContext from "@/pages/Appointment/context.js";
import FormatDate from "@/utils/formatDate.js";
import useOutsideEvent from "@/hooks/useOutsideEvent";
import ProcConfig from "@/config/procedures.js";
import docs from "@/constants/docs.js";
import { actions as userProceduresActions } from "@/service/redusers/userProcedures.js";

import style from "./Make.module.css";

function MakeProc() {
	const { t } = useTranslation();
	const { allProcedures, userProcedures } = useSelector((state) => state);
	const dispatch = useDispatch();
	const {
		visiblePopupState: [isVisible, setVisible],
		changePopupNameState: [, changePopupName],
	} = useContext(PropsContext);

	const [currentProcedure, indexSelectedProcedure] = userProcedures.currentProcedure;
	const isValidForAdding = ProcConfig.MAX_COUNT_PROCEDURE <= userProcedures.newProcedures.length
		|| (!currentProcedure.pdfPath && currentProcedure.type.contract);

	const [isOpenSelectProcedure, setOpenSelectProcedure] = useState(false);
	const [isOpenCalendar, setOpenCalendar] = useState(false);

	function onCloseSelectProcedure() {
		setOpenSelectProcedure(false);
	}

	const ref = useOutsideEvent(onCloseSelectProcedure);

	function handleSubmitForm(e) {
		e.preventDefault();

		if (isValidForAdding) {
			return;
		}

		if (userProcedures.newProcedures[indexSelectedProcedure]) {
			dispatch(userProceduresActions.updateProcStateByIndex([indexSelectedProcedure, false]));
		} else {
			dispatch(userProceduresActions.addProc());
		}

		const scrollYInPx = (currentProcedure.hour - ProcConfig.START_WORK_TIME)
			* userProcedures.hourHeightInPx;
		window.scrollTo(0, scrollYInPx);
	}

	function handleChangeProcName(ind) {
		const startProcMinutes = currentProcedure.hour * userProcedures.hourHeightInPx;
		const finishProcMinutes = startProcMinutes + allProcedures.types[ind].duration
			* userProcedures.hourHeightInPx;

		const newCurrProc = {
			...currentProcedure,
			finishProcTime: FormatDate.minutesToDate(
				finishProcMinutes,
				currentProcedure.finishProcTime,
				false,
			),
			type: allProcedures.types[ind],
		};

		dispatch(userProceduresActions.updateCurrProc([[newCurrProc, indexSelectedProcedure]]));
	}

	function onClose() {
		dispatch(userProceduresActions.updateCurrProc([
			[userProcedures.defaultProcedure, userProcedures.newProcedures.length],
			false,
		]));
	}

	function handleConirmContract(isConfirm) {
		dispatch(userProceduresActions.setCurrProcValue(
			["pdfPath", isConfirm ? docs[currentProcedure.type.contract] : null],
		));
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
			<form onSubmit={handleSubmitForm}>
				<div
					className={style.input}
					id="procedureName"
				>
					<h3 className={style.title}>{t("procedure")}</h3>
					<Select
						ref={ref}
						defaultValue={currentProcedure.type?.name}
						values={allProcedures.types.map((obj) => obj.name)}
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
						openCalendarState={[isOpenCalendar, setOpenCalendar]}
					/>
				</div>
				{currentProcedure.type.contract && (
					<div id="signature">
						<Checkbox
							text={t("agreeTerms")}
							onCheck={handleConirmContract}
							checked={Boolean(currentProcedure.pdfPath)}
						/>
						<a href={docs[currentProcedure.type.contract]} title={t("more")}>{t("readTerms")}</a>
					</div>
				)}
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
						disabled={!userProcedures.newProcedures.length}
					>
						{t("design")}
					</button>
				</div>
			</form>
		</Popup>
	);
}

export default MakeProc;
