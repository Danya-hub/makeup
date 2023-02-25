import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Calendar from "@/components/Calendar/Calendar.jsx";
import Aside from "@/components/Aside/Aside.jsx";

import PropsContext from "@/pages/AllProcedures/context.js";

import style from "./ControlPanel.module.css";

function ControlPanel() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const {
		viewState,
		handleChangeDate,
		visiblePopupState,
		setStartAndFinishTimes,
		selectTimeState,
		minHour,
	} = useContext(PropsContext);

	const [, setSelectTime] = selectTimeState;
	const [, setVisiblePopupState] = visiblePopupState;
	const isAuth = localStorage.getItem("isAuth");

	function handleClick() {
		if (!isAuth) {
			return navigate("/signin", {
				state: {
					purpose: "warningAuthToMakeAppointment",
				},
			});
		}

		const minutes = minHour * 60;

		setSelectTime(minHour);
		setStartAndFinishTimes(minutes);

		setVisiblePopupState(true);

		window.scrollTo(0, minutes);
	}

	return (
		<Aside id={style.controlPanel}>
			<button
				id={style.createNewProcedure}
				className="button border"
				onClick={handleClick}
			>
				{t("book")}
			</button>
			<Calendar
				options={viewState}
				onChange={handleChangeDate}
			></Calendar>
		</Aside>
	);
}

export { ControlPanel as default };
