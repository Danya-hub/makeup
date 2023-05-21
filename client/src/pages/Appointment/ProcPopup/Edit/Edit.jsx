import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

import Popup from "@/components/UI/Popup/Popup.jsx";
import Select from "@/components/UI/Form/Select/Select.jsx";
import TimeInput from "@/pages/Appointment/ProcPopup/TimeInput/TimeInput.jsx";
import DeleteButton from "@/pages/Appointment/components/DeleteButton/DeleteButton.jsx";

import ProcConfig from "@/config/procedures.js";
import GlobalContext from "@/context/global.js";
import FormatDate from "@/utils/formatDate.js";
import { actions as userProceduresActions } from "@/service/redusers/userProcedures.js";

import style from "./Edit.module.css";

function EditProc() {
	const {
		isVisiblePopup,
		setVisiblePopup,
		popup: [, popupActions],
		setPopup,
	} = useContext(GlobalContext);
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const {
		userProcedures,
	} = useSelector((state) => state);

	const [currentProcedure, indexSelectedProcedure] = userProcedures.currentProcedure;

	const [isOpenCalendar, setOpenCalendar] = useState(false);

	function handleSubmitForm(e) {
		e.preventDefault();

		const scrollYInPx = (currentProcedure.hour - ProcConfig.START_WORK_TIME)
			* userProcedures.hourHeightInPx;
		window.scrollTo(0, scrollYInPx);

		setPopup(["make", null]);

		if (popupActions) {
			popupActions.edit(currentProcedure);
		}

		dispatch(userProceduresActions.updateCurrProc([
			[userProcedures.defaultProcedure, userProcedures.newProcedures.length],
			false,
		]));
		dispatch(userProceduresActions.updateProcStateByIndex([
			indexSelectedProcedure,
			false,
			currentProcedure,
		]));
	}

	function handleCancel() {
		dispatch(userProceduresActions.updateCurrProc([
			[userProcedures.defaultProcedure, userProcedures.newProcedures.length],
			false,
		]));
		dispatch(userProceduresActions.updateProcStateByIndex([indexSelectedProcedure, false]));
		setPopup(["make", null]);
	}

	function handleDelete(index) {
		dispatch(userProceduresActions.deleteProc(index));

		if (userProcedures.newProcedures.length - 1 === 0) {
			setPopup(["make", null]);
		}

		if (popupActions) {
			popupActions.delete(currentProcedure);
		}
	}

	function handleChangeProcName(ind) {
		const startProcMinutes = currentProcedure.hour * userProcedures.hourHeightInPx;
		const finishProcMinutes = startProcMinutes + userProcedures.availableTypes[ind].duration
			* userProcedures.hourHeightInPx;

		const newProc = {
			...currentProcedure,
			finishProcTime: FormatDate.minutesToDate(
				finishProcMinutes,
				currentProcedure.finishProcTime,
			),
			type: userProcedures.availableTypes[ind],
		};

		dispatch(userProceduresActions.updateCurrProc([
			[
				newProc,
				indexSelectedProcedure,
			],
		]));
	}

	function onClose() {
		dispatch(userProceduresActions.updateCurrProc([
			[userProcedures.defaultProcedure, userProcedures.newProcedures.length],
			false,
		]));
		dispatch(userProceduresActions.updateProcStateByIndex([indexSelectedProcedure, false]));
		setPopup(["make", null]);
	}

	return (
		<Popup
			id={style.editProc}
			onClose={onClose}
			isSimple={false}
			isStrictActive={isVisiblePopup}
			strictSwitch={setVisiblePopup}
		>
			<form onSubmit={handleSubmitForm}>
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
				<div className={style.buttons}>
					<button
						type="button"
						id={style.cancel}
						onClick={handleCancel}
						className="button border"
					>
						{t("cancel")}
					</button>
					<div className={style.column}>
						<DeleteButton
							id={style.delete}
							className="border"
							index={indexSelectedProcedure}
							onClick={handleDelete}
						/>
						<button
							type="submit"
							id={style.edit}
							className="button border"
						>
							{t("change")}
						</button>
					</div>
				</div>
			</form>
		</Popup>
	);
}

export default EditProc;
