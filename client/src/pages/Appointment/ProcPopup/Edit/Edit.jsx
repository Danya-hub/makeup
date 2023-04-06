import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

import Popup from "@/components/UI/Popup/Popup.jsx";
import Select from "@/components/UI/Form/Select/Select.jsx";
import TimeInput from "@/pages/Appointment/ProcPopup/TimeInput/TimeInput.jsx";

import PropsContext from "@/pages/Appointment/context.js";
import FormatDate from "@/utils/formatDate.js";
import useOutsideEvent from "@/hooks/useOutsideEvent";
import { actions } from "@/service/redusers/userProcedures.js";

import style from "./Edit.module.css";

function EditProc() {
	const {
		visiblePopupState,
		changePopupNameState,
	} = useContext(PropsContext);
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const {
		userProcedures,
		allProcedures,
	} = useSelector((state) => state);

	const [currentProcedure, indexSelectedProcedure] = userProcedures.currentProcedure;
	const [isVisible, setVisible] = visiblePopupState;
	const [, changePopupName] = changePopupNameState;

	const [isOpenSelectProcedure, setOpenSelectProcedure] = useState(false);
	const [isOpenCalendar, setOpenCalendar] = useState(false);

	function onCloseSelectProcedure() {
		setOpenSelectProcedure(false);
	}

	const ref = useOutsideEvent(onCloseSelectProcedure);

	// function handleDelete() {
	// 	dispatch(actions.deleteProc(indexSelectedProcedure));

	// 	changePopupName("make");
	// }

	function handleSubmitForm(e) {
		e.preventDefault();

		dispatch(actions.updateProcStateByIndex([indexSelectedProcedure, false, currentProcedure]));
		dispatch(actions.updateCurrProc(
			[
				userProcedures.defaultProcedure,
				userProcedures.newProcedures.length,
			],
		));
		changePopupName("make");
	}

	function handleCancel() {
		dispatch(actions.updateProcStateByIndex([indexSelectedProcedure, false]));
		dispatch(actions.updateCurrProc(
			[
				userProcedures.defaultProcedure,
				userProcedures.newProcedures.length,
			],
		));
		changePopupName("make");
	}

	function handleChangeProcName(ind) {
		const startProcMinutes = currentProcedure.hour * userProcedures.hourHeightInPx;
		const finishProcMinutes = startProcMinutes + allProcedures.types[ind].duration
			* userProcedures.hourHeightInPx;

		const newProc = {
			...currentProcedure,
			finishProcTime: FormatDate.minutesToDate(
				finishProcMinutes,
				currentProcedure.finishProcTime,
				false,
			),
			type: allProcedures.types[ind],
		};

		dispatch(actions.updateCurrProc(
			[
				newProc,
				indexSelectedProcedure,
			],
		));
	}

	function onClose() {
		dispatch(actions.updateCurrProc(
			[
				userProcedures.defaultProcedure,
				userProcedures.newProcedures.length,
			],
		));

		if (!userProcedures.newProcedures[indexSelectedProcedure]) {
			return;
		}

		dispatch(actions.updateProcStateByIndex([indexSelectedProcedure, false]));
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
				<div className={style.buttons}>
					<button
						type="button"
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
					>
						{t("change")}
					</button>
				</div>
			</form>
		</Popup>
	);
}

export default EditProc;
