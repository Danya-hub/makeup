import { useRef, useLayoutEffect, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import FormatDate from "@/utils/formatDate.js";
import ProcConfig from "@/config/procedures.js";
import LangContext from "@/context/lang.js";
import Value from "@/helpers/value.js";
import userProcedureHelpers from "@/service/helpers/userProcedures.js";
import { asyncActions as allProceduresAsyncActions } from "@/service/redusers/allProcedures.js";
import { actions as userProceduresActions } from "@/service/redusers/userProcedures.js";
import { COLUMN_NAMES } from "@/pages/Appointment/constants";

import Cards from "./Cards/Cards.jsx";
import Diagram from "./Diagram/Diagram.jsx";
import Prompt from "@/components/UI/Prompt/Prompt.jsx";

import style from "./Presentation.module.css";

function Presentation() {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { allProcedures, userProcedures } = useSelector((state) => state);
	const [{
		currentLang,
	}] = useContext(LangContext);

	const parentRef = useRef(null);

	const [currentProcedure] = userProcedures.currentProcedure;
	const weekdayAndMonth = FormatDate.weekdayAndMonth(currentProcedure.startProcTime, currentLang, {
		weekday: "short",
	});
	const times = useRef(userProcedureHelpers.availableTimeByScrolling({
		minHour: ProcConfig.START_WORK_TIME,
		maxHour: ProcConfig.FINISH_WORK_TIME - 1,
	}).dates);
	const formatedTimes = times.current.map((date) => (
		FormatDate.stringHourAndMin(
			date,
			currentLang,
		)
	));
	const widthCharTime = Value.charWidthInPixels(formatedTimes[formatedTimes.length - 1]);

	useLayoutEffect(() => {
		const updateTime = setInterval(() => {
			dispatch(userProceduresActions.switchDay(userProcedures.locale.getDate()));

			if (!userProcedures.currentTimeHeightInPx && userProcedures.isCurrentTime) {
				dispatch(allProceduresAsyncActions.getProcedureByDay(userProcedures.locale));
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
				>
					{allProcedures.states.map((obj) => (
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
					))}
				</Prompt>
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
					hourHeightInPx={userProcedures.hourHeightInPx}
				/>
				<Cards
					widthCharTime={widthCharTime}
				/>
			</div>
		</div>
	);
}

export default Presentation;
