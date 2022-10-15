import { useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import types from "prop-types";

import { actions as navigateDateActions } from "@/service/redusers/navigateDate.js";
import FormatDate from "@/utils/formatDate.js";
import getWidthByChar from "@/helpers/widthByChar.js";

import Cart from "@/pages/Procedure/Cart/Cart.jsx";
import Loader from "@/features/Loader/Loader.jsx";

import style from "./Presentation.module.css";

const columnsName = ["time", "status", "procedureName"];

Presentation.propTypes = {
	newProcedure: types.array,
	warning: types.object,
	carts: types.array,
	locale: types.object,
	view: types.array,
	isVisiblePopup: types.array,
	isElapsedDay: types.func,
	formatViewDateByDay: types.func,
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
	newProcedure,
	warning,
	carts,
	locale,
	view,
	isVisiblePopup,
	isElapsedDay,
	formatViewDateByDay,
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
	const { t } = useTranslation();

	const isElapsed = isElapsedDay();
	const [_view, setViewDate] = view;
	const [_newProcedure, setNewProcedure] = newProcedure;
	const { hasWarning, setWarning } = warning;

	const [innerY, setInnerY] = useState(0);
	const [selectTime, setSelectTime] = useState(0);
	const [isMouseDown, setMouseDown] = useState(false);
	const parentRef = useRef(null);

	const [_isVisiblePopup, setVisiblePopup] = isVisiblePopup;
	const widthCharTime = Math.max(...numericHoursFromDay.map((hour) => getWidthByChar(hour)));

	function setNumericTimeByGrabbing(e, y = 0) {
		const topToRootEl = parentRef.current.offsetTop;

		const time = (e.pageY - topToRootEl + y) / hourHeightInPx;
		const rez = minHour > time ? minHour : maxHour < time ? maxHour : time;

		setSelectTime(rez);

		return rez;
	}

	function setStartAndFinishTimes(minutes) {
		const startProcMinutes = minutes || selectTime * 60,
			finishProcTime = startProcMinutes + _newProcedure.type.durationProc * 60;

		setNewProcedure((prev) => ({
			...prev,
			startProcTime: FormatDate.minutesInDate(startProcMinutes, _newProcedure.startProcTime, false),
			finishProcTime: FormatDate.minutesInDate(finishProcTime, _newProcedure.startProcTime, false),
		}));

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
			_newProcedure.type.durationProc * 60 < grabbingInnerY || 0 > grabbingInnerY
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
		const grabbingInnerY = onGrabbingCart(e);
		const minutesByClicking = setNumericTimeByGrabbing(e, -grabbingInnerY) * 60;

		setVisiblePopup(false);
		setMouseDown(!isElapsed);

		setStartAndFinishTimes(minutesByClicking);

		if (minutesByClicking === currentTimeHeightInPx) {
			window.scrollTo(0, minutesByClicking);
		}
	}

	useEffect(() => {
		const updateTime = setInterval(() => {
			const [newDay, isCurrent] = formatViewDateByDay(_view);

			dispatch(navigateDateActions.setNavigateDate([newDay, isCurrent]));
			setViewDate(newDay);

			onCrossingElapsedTime(selectTime * 60 - 1);
		}, (60 - new Date().getSeconds()) * 1000);

		return () => clearInterval(updateTime);
	}, [locale]);

	return isLoadingContent ? (
		<Loader></Loader>
	) : (
		<div
			className={_isVisiblePopup ? style.noActiveGrabbing : isMouseDown ? style.activeGrabbing : ""}
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
						{(_isVisiblePopup || isMouseDown) && (
							<Cart
								id={style.newProcedure}
								procedure={_newProcedure}
								styleAttr={{
									height: `${_newProcedure.type.durationProc * hourHeightInPx}px`,
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
