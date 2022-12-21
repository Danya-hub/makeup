import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import types from "prop-types";

import { getProcedureByDay } from "@/service/redusers/allProcedures.js";
import FormatDate from "@/utils/formatDate.js";
import changePropertyValue from "@/helpers/changePropertyValue.js";

import Cart from "@/pages/AllProcedures/Cart/Cart.jsx";
import Loader from "@/components/Loader/Loader.jsx";

import style from "./Presentation.module.css";

const columnsName = ["time", "status", "procedureName"];

Presentation.propTypes = {
	newProcedureState: types.array,
	warning: types.object,
	carts: types.array,
	viewState: types.object,
	visiblePopupState: types.array,
	isElapsedDay: types.func,
	switchDayOnOther: types.func,
	numericHoursFromDay: types.array,
	hourHeightInPx: types.number,
	minHour: types.number,
	maxHour: types.number,
	currentTimeHeightInPx: types.number,
	onTouchCart: types.func,
	onCrossingElapsedTime: types.func,
	isLoadingContent: types.bool,
	isCurrentTime: types.bool,
};

function Presentation({
	newProcedureState,
	warning,
	carts,
	viewState,
	visiblePopupState,
	isElapsedDay,
	switchDayOnOther,
	numericHoursFromDay,
	hourHeightInPx,
	minHour,
	maxHour,
	currentTimeHeightInPx,
	onTouchCart,
	onCrossingElapsedTime,
	isLoadingContent,
	isCurrentTime,
}) {
	const dispatch = useDispatch();
	const { info: userInfo } = useSelector((state) => state.user);
	const navigate = useNavigate();
	const { t } = useTranslation();

	const isElapsed = isElapsedDay(currentTimeHeightInPx);
	const [newProcedure, setNewProcedure] = newProcedureState;
	const { hasWarning, setWarning } = warning;
	const { locale, currentTime } = viewState;

	const [innerY, setInnerY] = useState(0);
	const [selectTime, setSelectTime] = useState(0);
	const [isMouseDown, setMouseDown] = useState(false);
	const parentRef = useRef(null);

	const [isVisiblePopup, setVisiblePopup] = visiblePopupState;

	const widthCharTime = Math.max(...numericHoursFromDay.map((hour) => hour.getWidthByChar()));

	function setNumericTimeByGrabbing(e, y = 0) {
		const topToRootEl = parentRef.current.offsetTop;

		const time = (e.pageY - topToRootEl + y) / hourHeightInPx;
		const rez = minHour > time ? minHour : maxHour < time ? maxHour : time;

		setSelectTime(rez);

		return rez;
	}

	function setStartAndFinishTimes(minutes) {
		const startProcMinutes = minutes || selectTime * 60,
			finishProcTime = startProcMinutes + newProcedure.type.durationProc * 60;

		changePropertyValue(
			{
				startProcTime: FormatDate.minutesInDate(
					startProcMinutes,
					newProcedure.startProcTime,
					false,
				),
				finishProcTime: FormatDate.minutesInDate(
					finishProcTime,
					newProcedure.startProcTime,
					false,
				),
			},
			setNewProcedure,
		);

		onTouchCart(startProcMinutes, finishProcTime);

		if (hasWarning("crossingElapsedTime")) {
			setWarning(["crossingElapsedTime", ""]);
		}
	}

	function onGrabbingCart(e) {
		const topToCart = selectTime * 60,
			topToRootEl = parentRef.current.offsetTop;
		const grabbingInnerY = e.pageY - topToRootEl - topToCart;

		const rez =
			newProcedure.type.durationProc * 60 < grabbingInnerY || 0 > grabbingInnerY
				? innerY
				: grabbingInnerY;

		setInnerY(rez);

		return rez;
	}

	function onMouseUp() {
		setStartAndFinishTimes();

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
		if (!userInfo) {
			return navigate("/signup", {
				replace: true,
				state: {
					purpose: "warningAuthToMakeAppointment",
				},
			});
		}

		const grabbingInnerY = onGrabbingCart(e);
		const minutesByClicking = setNumericTimeByGrabbing(e, -grabbingInnerY) * 60;

		setVisiblePopup(false);
		setMouseDown(!isElapsed);

		setStartAndFinishTimes(minutesByClicking);

		if (minutesByClicking === currentTimeHeightInPx) {
			window.scrollTo(0, minutesByClicking);
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
		<Loader></Loader>
	) : (
		<div
			className={isVisiblePopup ? style.noActiveGrabbing : isMouseDown ? style.activeGrabbing : ""}
			id={style.presentation}
		>
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
				className={style.wrapper}
				ref={parentRef}
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
					<div className={style.carts}>
						<div
							id={style.elapsedTime}
							style={{
								height: `${currentTimeHeightInPx}px`,
							}}
						>
							{isCurrentTime && <div id={style.current}></div>}
						</div>
						{(isVisiblePopup || isMouseDown) && (
							<Cart
								id={style.newProcedure}
								procedure={newProcedure}
								styleAttr={{
									height: `${newProcedure.type.durationProc * hourHeightInPx}px`,
									top: `${selectTime * hourHeightInPx}px`,
								}}
							></Cart>
						)}
						{carts.map((cart, i) => (
							<Cart
								key={`${cart.type.name}/${i}`}
								procedure={cart}
								styleAttr={{
									height: `${cart.type.durationProc * hourHeightInPx}px`,
									top: `${FormatDate.numericHoursFromDate(cart.startProcTime) * hourHeightInPx}px`,
								}}
							></Cart>
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
