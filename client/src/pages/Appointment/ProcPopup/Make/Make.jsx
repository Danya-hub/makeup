import { useState, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

import Popup from "@/components/UI/Popup/Popup.jsx";
import Select from "@/components/UI/Form/Select/Select.jsx";
import Checkbox from "@/components/UI/Form/Checkbox/Checkbox.jsx";
import TimeInput from "@/pages/Appointment/ProcPopup/TimeInput/TimeInput.jsx";

import RightArrowSrc from "@/assets/image/rightArrow.svg";
import MessageHelper from "./helpers/message.js";
import PropsContext from "@/pages/Appointment/context.js";
import FormatDate from "@/utils/formatDate.js";
import useOutsideEvent from "@/hooks/useOutsideEvent";
import ProcConfig from "@/config/procedures.js";
import docs from "@/helpers/docs.js";
import {
	actions as userProceduresActions,
} from "@/service/redusers/userProcedures.js";

import style from "./Make.module.css";

function MakeProc() {
	const { t } = useTranslation();
	const {
		userProcedures,
	} = useSelector((state) => state);
	const dispatch = useDispatch();
	const {
		visiblePopupState: [isVisible, setVisible],
		changePopupNameState: [, changePopupName],
	} = useContext(PropsContext);
	const Message = useMemo(
		() => MessageHelper.check(userProcedures),
		[userProcedures.availableTypes, userProcedures.newProcedures],
	);

	const [currentProcedure, indexSelectedProcedure] = userProcedures.currentProcedure;
	const isValidForAdding = (!currentProcedure.contract && currentProcedure.type.contract);

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
		const finishProcMinutes = startProcMinutes + userProcedures.availableTypes[ind].duration
			* userProcedures.hourHeightInPx;

		const newCurrProc = {
			...currentProcedure,
			finishProcTime: FormatDate.minutesToDate(
				finishProcMinutes,
				currentProcedure.finishProcTime,
			),
			type: userProcedures.availableTypes[ind],
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
			["contract", isConfirm ? docs[currentProcedure.type.contract] : null],
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
				{Message.component}
				<div
					className={style.input}
					id="procedureName"
				>
					<h3 className={style.title}>{t("procedure")}</h3>
					<Select
						ref={ref}
						defaultValue={t(currentProcedure.type?.name)}
						values={userProcedures.availableTypes.map((obj) => t(obj.name))}
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
					<div className={style.signature}>
						<Checkbox
							className={style.agreeTerms}
							text={t("agreeTerms")}
							onCheck={handleConirmContract}
							checked={Boolean(currentProcedure.contract)}
						/>
						<a
							className={style.pdfLink}
							href={docs[currentProcedure.type.contract][0]}
							title={t("more")}
						>
							{t("readTerms")}
						</a>
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
						{Boolean(userProcedures.newProcedures.length)
							&& <span id={style.countProcedures}>{userProcedures.newProcedures.length}</span>}
						{t("design")}
						<img
							className={style.arrow}
							src={RightArrowSrc}
							alt="rightArrow"
						/>
					</button>
				</div>
			</form>
		</Popup>
	);
}

export default MakeProc;
