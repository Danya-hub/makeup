import { useState, useContext, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

import Popup from "@/components/UI/Popup/Popup.jsx";
import Select from "@/components/UI/Form/Select/Select.jsx";
import Checkbox from "@/components/UI/Form/Checkbox/Checkbox.jsx";
import TimeInput from "@/pages/Appointment/ProcPopup/TimeInput/TimeInput.jsx";

import RightArrowSrc from "@/assets/image/rightArrow.svg";
import MessageHelper from "./helpers/message.js";
import GlobalContext from "@/context/global.js";
import FormatDate from "@/utils/formatDate.js";
import ProcConfig from "@/config/procedures.js";
import docs from "@/utils/docs.js";
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
		isVisiblePopup,
		setVisiblePopup,
		setPopupName,
	} = useContext(GlobalContext);
	const Message = useMemo(
		() => MessageHelper.check(userProcedures),
		[userProcedures.availableTypes, userProcedures.newProcedures],
	);

	const [currentProcedure, indexSelectedProcedure] = userProcedures.currentProcedure;
	const isValidForAdding = (!currentProcedure.contract && currentProcedure.type.contract);

	const [isOpenCalendar, setOpenCalendar] = useState(false);

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
		setPopupName("");
	}

	const handleConirmContract = useCallback((isConfirm) => {
		dispatch(userProceduresActions.setCurrProcValue(
			["contract", isConfirm ? docs[currentProcedure.type.contract] : null],
		));
	}, []);

	return (
		<Popup
			id={style.makeProc}
			onClose={onClose}
			isSimple={false}
			isStrictActive={isVisiblePopup}
			strictSwitch={setVisiblePopup}
		>
			<form onSubmit={handleSubmitForm}>
				{Message.component}
				<div
					className={style.input}
					id="procedureName"
				>
					<h3 className={style.title}>{t("procedure")}</h3>
					<Select
						id="procedureName"
						defaultValue={t(currentProcedure.type?.name)}
						values={userProcedures.availableTypes.map((obj) => t(obj.name))}
						onChange={handleChangeProcName}
					/>
				</div>
				<div id="time">
					<h3 className={style.title}>{t("time")}</h3>
					<TimeInput
						isOpenCalendar={isOpenCalendar}
						setOpenCalendar={setOpenCalendar}
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
						onClick={() => setPopupName("design")}
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
