import { useState, useRef, useLayoutEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import types from "prop-types";

import { getProcedureByDay } from "@/service/redusers/procedures.js";
import FormatDate from "@/utils/formatDate.js";
import Value from "@/helpers/value.js";
import AuthContext from "@/context/auth.js";

import Card from "@/pages/AllProcedures/Card/Card.jsx";
import SimpleLoader from "@/components/SimpleLoader/SimpleLoader.jsx";

import style from "./Presentation.module.css";

const columnsName = ["time", "status", "procedureName"];

Presentation.propTypes = {
	newProcedureState: types.array,
	warning: types.object,
	cards: types.array,
	viewState: types.object,
	visiblePopupState: types.array,
	isElapsedDay: types.func,
	switchDayOnOther: types.func,
	numericHoursFromDay: types.array,
	hourHeightInPx: types.number,
	minHour: types.number,
	maxHour: types.number,
	currentTimeHeightInPx: types.number,
	onTouchCard: types.func,
	onCrossingElapsedTime: types.func,
	isCurrentTime: types.bool,
	isLoadingContent: types.bool,
};

function Presentation({
	newProcedureState,
	warning,
	cards,
	viewState,
	visiblePopupState,
	isElapsedDay,
	switchDayOnOther,
	numericHoursFromDay,
	hourHeightInPx,
	minHour,
	maxHour,
	currentTimeHeightInPx,
	onTouchCard,
	onCrossingElapsedTime,
	isCurrentTime,
	isLoadingContent,
}) {
	const dispatch = useDispatch();
	const { currLng } = useSelector((state) => state.langs);
	const navigate = useNavigate();
	const { t } = useTranslation();

	const isElapsed = isElapsedDay(currentTimeHeightInPx);
	const [newProcedure, setNewProcedure] = newProcedureState;
	const { hasWarning, setWarning } = warning;
	const { locale, currentTime } = viewState;
	const [isVisiblePopup, setVisiblePopup] = visiblePopupState;

	const { isAuth } = useContext(AuthContext);
	const [innerY, setInnerY] = useState(0);
	const [selectTime, setSelectTime] = useState(minHour);
	const [isMouseDown, setMouseDown] = useState(false);
	const parentRef = useRef(null);

	const widthCharTime = Math.max(...numericHoursFromDay.map((hour) => hour.getWidthByChar()));
	const currentStirngHoursAndMinutes = FormatDate.stringHourAndMin(locale, currLng);

	function setNumericTimeByGrabbing(e, y = 0) {
		const topToRootEl = parentRef.current.offsetTop;
		const durationProc = newProcedure.type.durationProc;

		const time = (e.pageY - topToRootEl + y) / hourHeightInPx;
		const rez =
			minHour > time ? minHour : maxHour - durationProc < time ? maxHour - durationProc : time;

		setSelectTime(rez);

		return rez;
	}

	function setStartAndFinishTimes(minutes) {
		const startProcMinutes = minutes || selectTime * 60,
			finishProcMinutes = startProcMinutes + newProcedure.type.durationProc * 60;

		const startProcTime = FormatDate.minutesToDate(startProcMinutes, locale, false),
			finishProcTime = FormatDate.minutesToDate(finishProcMinutes, locale, false);

		Value.changeObject(
			{
				startProcTime,
				finishProcTime,
			},
			setNewProcedure
		);
		onTouchCard(startProcMinutes, finishProcMinutes);

		const _hasWarning = hasWarning("crossingElapsedTime");

		if (_hasWarning) {
			setWarning(["crossingElapsedTime", ""]);
		}
	}

	function onGrabbingCard(e) {
		const topToCard = selectTime * 60,
			topToRootEl = parentRef.current.offsetTop;
		const grabbingInnerY = e.pageY - topToRootEl - topToCard;

		const rez =
			newProcedure.type.durationProc * 60 < grabbingInnerY || 0 > grabbingInnerY
				? innerY
				: grabbingInnerY;

		setInnerY(rez);

		return rez;
	}

	function onMouseUp(e) {
		const minutesByMouseUp = setNumericTimeByGrabbing(e, -innerY) * 60;

		setStartAndFinishTimes(minutesByMouseUp);

		setVisiblePopup(!isElapsed);
		setMouseDown(false);
	}

	function onMouseMove(e) {
		if (!isMouseDown) {
			return;
		}

		setNumericTimeByGrabbing(e, -innerY);
	}

	function onMouseDown(e) {
		if (!isAuth) {
			return navigate("/signin", {
				state: {
					purpose: "warningAuthToMakeAppointment",
				},
			});
		}

		const grabbingInnerY = onGrabbingCard(e);
		const minutesByMouseDown = setNumericTimeByGrabbing(e, -grabbingInnerY) * 60;

		setVisiblePopup(false);
		setMouseDown(!isElapsed);

		setStartAndFinishTimes(minutesByMouseDown);

		if (minutesByMouseDown === currentTimeHeightInPx) {
			window.scrollTo(0, minutesByMouseDown);
		}
	}

	useLayoutEffect(() => {
		const updateTime = setInterval(() => {
			const { newDate } = switchDayOnOther(locale);

			if (!currentTimeHeightInPx) {
				dispatch(getProcedureByDay(newDate));
				currentTime.current.day = newDate.getDate();
			}

			onCrossingElapsedTime(selectTime * 60 - 1);
		}, (60 - new Date().getSeconds()) * 1000);

		return () => clearInterval(updateTime);
	}, [locale]);

	return isLoadingContent ? (
		<SimpleLoader></SimpleLoader>
	) : (
		<div
			className={isVisiblePopup ? style.noActiveGrabbing : isMouseDown ? style.activeGrabbing : ""}
			id={style.presentation}
		>
			<h2>{currentStirngHoursAndMinutes}</h2>
			<div className={style.nameColumns}>
				<div
					style={{
						width: `calc(100% - ${widthCharTime}px)`,
					}}
				>
					{columnsName.map((name, i) => (
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
					<div className={style.hours}>
						{numericHoursFromDay.map((hour, i, arr) => (
							<div
								className={style.cell}
								key={hour + "/" + i}
								style={{
									height: hourHeightInPx,
									width: `${widthCharTime}px`,
								}}
							>
								<span
									style={{
										visibility: i === 0 || i === arr.length - 1 ? "hidden" : "",
									}}
								>
									{hour}
								</span>
							</div>
						))}
					</div>
					<div className={style.cards}>
						<div
							id={style.elapsedTime}
							style={{
								height: `${currentTimeHeightInPx}px`,
							}}
						>
							{isCurrentTime && <div id={style.current}></div>}
						</div>
						{(isVisiblePopup || isMouseDown) && (
							<Card
								id={style.newProcedure}
								procedure={newProcedure}
								styleAttr={{
									height: `${newProcedure.type.durationProc * hourHeightInPx}px`,
									top: `${selectTime * hourHeightInPx}px`,
								}}
							></Card>
						)}
						{cards.map((card, i) => (
							<Card
								key={`${card.type.name}/${i}`}
								procedure={card}
								styleAttr={{
									height: `${card.type.durationProc * hourHeightInPx}px`,
									top: `${FormatDate.numericHoursFromDate(card.startProcTime) * hourHeightInPx}px`,
								}}
							></Card>
						))}
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
