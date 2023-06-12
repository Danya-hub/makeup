import { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Calendar from "@/components/UI/Calendar/Calendar.jsx";
import Filters from "./Filters/Filters.jsx";
import DesignButton from "@/components/UI/Form/DesignButton/DesignButton.jsx";

import {
	actions as appointmentsActions,
} from "@/service/redusers/appointments.js";
import GlobalContext from "@/context/global.js";
import PropsContext from "@/pages/Appointment/context/context.js";
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
	} = useSelector((state) => state.appointments);
	const {
		setPopup,
		setVisiblePopup,
		isAuth,
	} = useContext(GlobalContext);
	const {
		setFadeAnimation,
	} = useContext(PropsContext);

	const calendarOptions = useMemo(() => ({
		year: currentProcedure.year,
		month: currentProcedure.month,
		setMonth: (m) => dispatch(appointmentsActions.switchMonth(m)),
		day: currentProcedure.day,
		setDay: (d) => dispatch(appointmentsActions.switchDay(d)),
		locale,
		strictTimeObject,
	}), [currentProcedure]);

	function handleMake() {
		if (!isAuth) {
			navigate("/signin", {
				state: {
					purpose: "warningAuthToMakeAppointment",
				},
			});
			return;
		}

		dispatch(appointmentsActions.changeHour(availableHoursTime[0] - ProcConfig.START_WORK_TIME));
		setVisiblePopup(true);
		setPopup(["make", null]);

		const scrollYInPx = (availableHoursTime[0] - ProcConfig.START_WORK_TIME)
			* hourHeightInPx;
		window.scrollTo(0, scrollYInPx);
	}

	function handleDesign() {
		setVisiblePopup(true);
		setPopup(["design", null]);
	}

	function handleChangeCalendar(date, onSuccess) {
		onSuccess();
		setFadeAnimation(true);
	}

	return (
		<aside id={style.controlPanel}>
			<div
				className={style.buttons}
			>
				{Boolean(newProcedures.length) && (
					<DesignButton
						countProcedures={newProcedures.length}
						pulseAnimation
						pointStyles={{
							transform: "translate(50%, -50%)",
							top: 0,
							right: 0,
						}}
						onClick={handleDesign}
						text={t("myCurrentServices")}
					/>
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
				onChange={handleChangeCalendar}
			/>
			<Filters />
		</aside>
	);
}

export default ControlPanel;
