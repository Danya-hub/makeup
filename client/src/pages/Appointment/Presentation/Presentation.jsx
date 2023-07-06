import { useRef, useLayoutEffect, useEffect, useContext, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import DateFormatter from "@/utils/dateFormatter.js";
import GlobalContext from "@/context/global.js";
import DataFormatter from "@/utils/dataFormatter.js";
import userProcedureHelpers from "@/service/helpers/appointments.js";
import {
	actions as appointmentsActions,
	asyncActions as appointmentsAsyncActions,
} from "@/service/redusers/appointments.js";
import { COLUMN_NAMES } from "@/pages/Appointment/constants/constants.js";
import ProcConfig, { states } from "@/config/procedures.js";
import PropsContext from "@/pages/Appointment/context/context.js";

import Cards from "./Cards/Cards.jsx";
import Diagram from "./Diagram/Diagram.jsx";
import Prompt from "@/components/UI/Prompt/Prompt.jsx";

import style from "./Presentation.module.css";

const stateArray = Object.values(states);

function Presentation() {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { appointments } = useSelector((state) => state);
	const {
		currentLang,
	} = useContext(GlobalContext);
	const {
		fadeAnimation,
		setFadeAnimation,
	} = useContext(PropsContext);

	const parentRef = useRef(null);

	const weekdayAndMonth = useMemo(() => DateFormatter.weekdayAndMonth(
		appointments.locale,
		currentLang,
		{
			weekday: "short",
		},
	), [currentLang, appointments.locale]);
	const times = useRef(userProcedureHelpers.availableTimeByDay({
		minHour: ProcConfig.START_WORK_TIME,
		maxHour: ProcConfig.FINISH_WORK_TIME - 1,
	}).dates);
	const formatedTimes = useMemo(() => times.current.map((date) => (
		DateFormatter.stringHourAndMin(
			date,
			currentLang,
		)
	)), [currentLang]);
	const widthCharTime = useMemo(
		() => DataFormatter.charWidthInPixels(
			formatedTimes[formatedTimes.length - 1],
		),
		[formatedTimes],
	);
	const promptRender = useCallback(() => (
		stateArray.map((obj) => (
			<div
				className={style.row}
				key={obj.name}
			>
				<i
					className="fa fa-bookmark color"
					aria-hidden="true"
					style={{
						WebkitTextStroke: obj.color === "white" ? "1px rgb(var(--black))" : "",
						color: `rgb(var(--${obj.color}))`,
					}}
				/>
				<p className="text">{t(obj.name)}</p>
			</div>
		))
	), []);

	function handleAnimationStart() {
		dispatch(appointmentsAsyncActions.getProcedureByDay(appointments.locale));
	}

	function handleAnimationEnd() {
		setFadeAnimation(false);
	}

	useLayoutEffect(() => {
		const updateTime = setInterval(() => {
			dispatch(appointmentsActions.switchDay(appointments.locale.getDate()));

			if (!appointments.currentTimeHeightInPx && appointments.isCurrentTime) {
				dispatch(appointmentsAsyncActions.getProcedureByDay(appointments.locale));
			}
		}, (60 - new Date().getSeconds()) * 1000);

		return () => clearInterval(updateTime);
	}, [appointments.locale]);

	useEffect(() => {
		window.scrollTo(0, appointments.minDayTime * appointments.hourHeightInPx);
	}, []);

	return (
		<div
			id={style.presentation}
		>
			<div className={style.top}>
				<span id={style.date}>{weekdayAndMonth}</span>
				<Prompt
					id={style.design}
					iconName="question-circle-o"
					text={t("status")}
					direction="right"
					render={promptRender}
				/>
			</div>
			<div
				ref={parentRef}
				className={style.wrapper}
			>
				<div
					className={style.bottom}
					style={{
						paddingLeft: widthCharTime,
					}}
				>
					{COLUMN_NAMES.map((name) => (
						<h3 key={name}>{t(name)}</h3>
					))}
				</div>
				<div
					className={fadeAnimation ? style.fade : ""}
					onAnimationStart={handleAnimationStart}
					onAnimationEnd={handleAnimationEnd}
				>
					<Diagram
						formatedTimes={formatedTimes}
						widthCharTime={widthCharTime}
					/>
					<Cards
						widthCharTime={widthCharTime}
						ref={parentRef}
					/>
				</div>
			</div>
		</div>
	);
}

export default Presentation;
