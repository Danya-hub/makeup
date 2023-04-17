import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Calendar from "@/components/UI/Calendar/Calendar.jsx";
import Filters from "./Filters/Filters.jsx";

import { actions } from "@/service/redusers/userProcedures.js";
import PropsContext from "@/pages/Appointment/context.js";
import ProcConfig from "@/config/procedures.js";

import style from "./ControlPanel.module.css";

function ControlPanel() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const {
		strictTimeObject,
		currentProcedure: [currentProcedure],
		locale,
		hourHeightInPx,
		availableHoursTime,
		newProcedures,
	} = useSelector((state) => state.userProcedures);
	const {
		visiblePopupState: [, setVisiblePopupState],
		changePopupNameState: [, changePopupName],
	} = useContext(PropsContext);

	const calendarOptions = {
		year: currentProcedure.year,
		month: [currentProcedure.month, (m) => dispatch(actions.switchMonth(m))],
		day: [currentProcedure.day, (d) => dispatch(actions.switchDay(d))],
		locale,
		strictTimeObject,
	};
	const isAuth = localStorage.getItem("token");

	function handleMake() {
		if (!isAuth) {
			navigate("/signin", {
				state: {
					purpose: "warningAuthToMakeAppointment",
				},
			});
			return;
		}

		dispatch(actions.changeHour(availableHoursTime[0] - ProcConfig.START_WORK_TIME));
		setVisiblePopupState(true);

		const scrollYInPx = (availableHoursTime[0] - ProcConfig.START_WORK_TIME)
			* hourHeightInPx;
		window.scrollTo(0, scrollYInPx);
	}

	function handleDesign() {
		changePopupName("design");
		setVisiblePopupState(true);
	}

	return (
		<aside id={style.controlPanel}>
			<div
				className={style.buttons}
			>
				{Boolean(newProcedures.length) && (
					<button
						type="button"
						id={style.designProcedure}
						className="button border"
						onClick={handleDesign}
					>
						<span id={style.countProcedures}>{newProcedures.length}</span>
						{t("appointmentList")}
					</button>
				)}
				<button
					type="button"
					id={style.makeNewProcedure}
					className="button border"
					onClick={handleMake}
				>
					{t("book")}
				</button>
			</div>
			<Calendar
				options={calendarOptions}
			/>
			<Filters />
		</aside>
	);
}

export default ControlPanel;
