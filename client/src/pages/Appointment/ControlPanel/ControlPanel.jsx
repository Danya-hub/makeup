import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Calendar from "@/components/Calendar/Calendar.jsx";

import { actions } from "@/service/redusers/userProcedures.js";
import PropsContext from "@/pages/Appointment/context.js";

import style from "./ControlPanel.module.css";

function ControlPanel() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const {
		strictTimeObject,
		currentProcedure: [currentProcedure],
		minDayTime,
		locale,
	} = useSelector((state) => state.userProcedures);
	const {
		visiblePopupState: [, setVisiblePopupState],
	} = useContext(PropsContext);

	const calendarOptions = {
		year: currentProcedure.year,
		month: [currentProcedure.month, (m) => dispatch(actions.switchMonth(m))],
		day: [currentProcedure.day, (d) => dispatch(actions.switchDay(d))],
		locale,
		strictTimeObject,
	};
	const isAuth = localStorage.getItem("token");
	function handleClick() {
		if (!isAuth) {
			navigate("/signin", {
				state: {
					purpose: "warningAuthToMakeAppointment",
				},
			});
			return;
		}

		const minutes = currentProcedure.minDayTime * 60;

		dispatch(actions.changeHour(minDayTime));
		setVisiblePopupState(true);

		window.scrollTo(0, minutes);
	}

	return (
		<aside id={style.controlPanel}>
			<button
				type="button"
				id={style.createNewProcedure}
				className="button border"
				onClick={handleClick}
			>
				{t("book")}
			</button>
			<Calendar
				options={calendarOptions}
			/>
		</aside>
	);
}

export default ControlPanel;
