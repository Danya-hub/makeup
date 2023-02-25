import { useState, useRef, useLayoutEffect, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getProcedureByDay } from "@/service/redusers/procedures.js";
import FormatDate from "@/utils/formatDate.js";
import PropsContext from "@/pages/AllProcedures/context.js";

import SideHours from "./SideHours/SideHours.jsx";
import Prompt from "@/components/UI/Prompt/Prompt.jsx";
import Card from "@/pages/AllProcedures/Card/Card.jsx";

import style from "./Presentation.module.css";

import { COLUMN_NAMES } from "@/pages/AllProcedures/constants.js";

function Presentation() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { procedures, langs } = useSelector((state) => state);
	const {
		changePopupNameState,
		newProceduresState,
		currProcedureState,
		viewState,
		visiblePopupState,
		isElapsedDay,
		switchDayOnOther,
		numericHoursFromDay,
		hourHeightInPx,
		minHour,
		maxHour,
		currentTimeHeightInPx,
		onCrossingElapsedTime,
		isCurrentTime,
		selectTimeState,
		setStartAndFinishTimes,
		dateDirection,
		getDragY,
		edit: editProcedureByIndex,
	} = useContext(PropsContext);

	const [innerY, setInnerY] = useState(0);
	const [isMouseDown, setMouseDown] = useState(false);
	const parentRef = useRef(null);

	const isElapsed = isElapsedDay(currentTimeHeightInPx);
	const [newProcedures] = newProceduresState;
	const [[currProcedure]] = currProcedureState;
	const { locale, strictTimeObject, localeTimeObject } = viewState;
	const [isVisiblePopup, setVisiblePopup] = visiblePopupState;
	const [selectTime, setSelectTime] = selectTimeState;
	const widthCharTime = Math.max(...numericHoursFromDay.map((hour) => hour.getWidthByChar()));
	const weekdayAndMonth = FormatDate.weekdayAndMonth(currProcedure.startProcTime, langs.currLng, {
		weekday: "short",
	});
	const currentStirngHoursAndMinutes = FormatDate.stringHourAndMin(locale, langs.currLng);
	const [popupName] = changePopupNameState;
	const isAuth = localStorage.getItem("isAuth");

	function setNumericTimeByGrabbing(pageY, y = 0) {
		const topToRootEl = parentRef.current.offsetTop;
		const durationProc = currProcedure.type.durationProc;

		const time = (pageY - topToRootEl + y) / hourHeightInPx;
		const rez =
			minHour > time ? minHour : maxHour - durationProc < time ? maxHour - durationProc : time;

		setSelectTime(rez);

		return rez;
	}

	function onGrabbingCard(pageY) {
		const topToCard = selectTime * 60,
			topToRootEl = parentRef.current.offsetTop;
		const grabbingInnerY = pageY - topToRootEl - topToCard;

		const rez =
			currProcedure.type.durationProc * 60 < grabbingInnerY || 0 > grabbingInnerY
				? innerY
				: grabbingInnerY;

		setInnerY(rez);

		return rez;
	}

	function onMouseUp(e) {
		const y = getDragY(e.pageY);
		const minutesByMouseUp = setNumericTimeByGrabbing(y, -innerY) * 60;

		setVisiblePopup(!isElapsed);
		setMouseDown(false);

		setStartAndFinishTimes(minutesByMouseUp);

		if (minutesByMouseUp === currentTimeHeightInPx) {
			window.scrollTo(0, minutesByMouseUp);
		}
	}

	function onMouseMove(e) {
		if (!isMouseDown) {
			return;
		}

		const y = getDragY(e.pageY);

		setNumericTimeByGrabbing(y, -innerY);
	}

	function onMouseDown(e) {
		if (!isAuth) {
			return navigate("/signin", {
				state: {
					purpose: "warningAuthToMakeAppointment",
				},
			});
		}

		const y = getDragY(e.pageY);

		const grabbingInnerY = onGrabbingCard(y);
		const minutesByMouseDown = setNumericTimeByGrabbing(y, -grabbingInnerY) * 60;

		setVisiblePopup(false);
		setMouseDown(!isElapsed);

		setStartAndFinishTimes(minutesByMouseDown);
	}

	useLayoutEffect(() => {
		const updateTime = setInterval(() => {
			const { newDate, isCurrent } = switchDayOnOther(locale);

			if (!currentTimeHeightInPx && isCurrent) {
				dispatch(getProcedureByDay(newDate));
				strictTimeObject.current.day = newDate.getDate();
			}

			onCrossingElapsedTime(selectTime * 60 - 1);
		}, (60 - new Date().getSeconds()) * 1000);

		return () => clearInterval(updateTime);
	}, [locale]);

	useEffect(() => {
		window.scrollTo(0, minHour * 60);
	}, []);

	return (
		<div
			className={isVisiblePopup ? style.noActiveGrabbing : isMouseDown ? style.activeGrabbing : ""}
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
					{procedures.states.map((obj, i) => (
						<div
							className={style.row}
							key={"design/" + i}
						>
							<i
								className="fa fa-bookmark color"
								aria-hidden="true"
								style={{
									WebkitTextStroke: obj.color === "white" ? "1px rgb(var(--black))" : "",
									color: `rgb(var(--${obj.color}))`,
								}}
							></i>
							<p className="text">{t(obj.name)}</p>
						</div>
					))}
				</Prompt>
			</div>
			<div className={style.bottom}>
				<div
					style={{
						width: `calc(100% - ${widthCharTime}px)`,
					}}
				>
					{COLUMN_NAMES.map((name, i) => (
						<h3 key={`${name}/${i}`}>{t(name)}</h3>
					))}
				</div>
			</div>
			<div
				ref={parentRef}
				className={style.wrapper}
				onMouseUp={onMouseUp}
				onMouseMove={onMouseMove}
				onMouseDown={onMouseDown}
			>
				<div className={style.content}>
					<SideHours
						numericHoursFromDay={numericHoursFromDay}
						hourHeightInPx={hourHeightInPx}
						widthCharTime={widthCharTime}
					></SideHours>
					<div className={style.cards}>
						<div
							id={style.elapsedTime}
							style={{
								height: `${currentTimeHeightInPx}px`,
							}}
						>
							{isCurrentTime && (
								<div id={style.current}>
									<span className={style.time}>{currentStirngHoursAndMinutes}</span>
								</div>
							)}
						</div>
						{popupName != "design" && (isVisiblePopup || isMouseDown) && (
							<Card
								isSelected={true}
								isAddedToList={false}
								className={style.newProcedure}
								procedure={currProcedure}
								styleAttr={{
									height: `${currProcedure.type.durationProc * hourHeightInPx}px`,
									top: `${selectTime * hourHeightInPx}px`,
								}}
							></Card>
						)}
						{newProcedures.map(([proc, _isSelected], i) => {
							const top = FormatDate.numericHoursFromDate(proc.startProcTime) * hourHeightInPx;
							let isAccessRender = false;

							const callback = dateDirection(({ isCurrent }) => {
								isAccessRender = !_isSelected && isCurrent;
							});

							callback(proc.startProcTime, localeTimeObject);

							return (
								isAccessRender && (
									<Card
										isAddedToList={false}
										onMouseDown={() => editProcedureByIndex(i, proc)}
										key={`${proc.type.name}/${i}/newProcedure`}
										className={style.newProcedure}
										procedure={proc}
										styleAttr={{
											height: `${proc.type.durationProc * hourHeightInPx}px`,
											top: `${top}px`,
										}}
									></Card>
								)
							);
						})}
						{procedures.cards.map((card, i) => {
							const top = FormatDate.numericHoursFromDate(card.startProcTime) * hourHeightInPx;

							return (
								<Card
									key={`${card.type.name}/${i}/procedure`}
									procedure={card}
									styleAttr={{
										height: `${card.type.durationProc * hourHeightInPx}px`,
										top: `${top}px`,
									}}
								></Card>
							);
						})}
					</div>
				</div>
				<div className={style.lines}>
					{numericHoursFromDay.map((hour, i) => (
						<div
							key={hour + "/" + i}
							style={{
								height: hourHeightInPx,
							}}
							className={style.lineHour}
						></div>
					))}
				</div>
			</div>
		</div>
	);
}

export { Presentation as default };
