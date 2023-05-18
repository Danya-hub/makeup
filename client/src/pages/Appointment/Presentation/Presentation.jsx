import { useRef, useLayoutEffect, useEffect, useContext, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import FormatDate from "@/utils/formatDate.js";
import GlobalContext from "@/context/global.js";
import Value from "@/utils/value.js";
import userProcedureHelpers from "@/service/helpers/userProcedures.js";
import {
	actions as userProceduresActions,
	asyncActions as userProceduresAsyncActions,
} from "@/service/redusers/userProcedures.js";
import { COLUMN_NAMES } from "@/pages/Appointment/constants/constants.js";
import ProcConfig, { states } from "@/config/procedures.js";

import Cards from "./Cards/Cards.jsx";
import Diagram from "./Diagram/Diagram.jsx";
import Prompt from "@/components/UI/Prompt/Prompt.jsx";

import style from "./Presentation.module.css";

const stateArray = Object.values(states);

function Presentation() {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { userProcedures } = useSelector((state) => state);
	const {
		currentLang,
	} = useContext(GlobalContext);

	const parentRef = useRef(null);

	const weekdayAndMonth = useMemo(() => FormatDate.weekdayAndMonth(
		userProcedures.locale,
		currentLang,
		{
			weekday: "short",
		},
	), [currentLang, userProcedures.locale]);
	const times = useRef(userProcedureHelpers.availableTimeByDay({
		minHour: ProcConfig.START_WORK_TIME,
		maxHour: ProcConfig.FINISH_WORK_TIME - 1,
	}).dates);
	const formatedTimes = useMemo(() => times.current.map((date) => (
		FormatDate.stringHourAndMin(
			date,
			currentLang,
		)
	)), [currentLang]);
	const widthCharTime = useMemo(
		() => Value.charWidthInPixels(
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

	useLayoutEffect(() => {
		const updateTime = setInterval(() => {
			dispatch(userProceduresActions.switchDay(userProcedures.locale.getDate()));

			if (!userProcedures.currentTimeHeightInPx && userProcedures.isCurrentTime) {
				dispatch(userProceduresAsyncActions.getProcedureByDay(userProcedures.locale));
			}
		}, (60 - new Date().getSeconds()) * 1000);

		return () => clearInterval(updateTime);
	}, [userProcedures.locale]);

	useEffect(() => {
		window.scrollTo(0, userProcedures.minDayTime * userProcedures.hourHeightInPx);
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
				<Diagram
					formatedTimes={formatedTimes}
					widthCharTime={widthCharTime}
				/>
				<Cards
					widthCharTime={widthCharTime}
				/>
			</div>
		</div>
	);
}

export default Presentation;
