import { useContext, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import FormatDate from "@/utils/formatDate.js";
import PropsContext from "@/pages/Appointment/context.js";
import LangContext from "@/context/lang.js";
import { actions } from "@/service/redusers/userProcedures.js";
import ProcConfig from "@/config/procedures.js";
import AllProceduresHelper from "@/service/helpers/allProcedures.js";
import UserProceduresHelper from "@/service/helpers/userProcedures.js";

import Card from "@/pages/Appointment/Card/Card.jsx";

import style from "./Cards.module.css";

function Cards() {
	const dispatch = useDispatch();
	const { allProcedures, userProcedures } = useSelector((state) => state);
	const {
		changePopupNameState: [popupName, changePopupName],
		visiblePopupState: [isVisiblePopup, setVisiblePopup],
	} = useContext(PropsContext);
	const [{
		currentLang,
	}] = useContext(LangContext);
	const navigate = useNavigate();
	const parentRef = useRef(null);

	const [isMouseDown, setMouseDown] = useState(false);

	const [currentProcedure] = userProcedures.currentProcedure;
	const classNameByPresentState = (isVisiblePopup && "noActiveGrabbing") || (isMouseDown && "activeGrabbing") || "";
	const isAuth = localStorage.getItem("token");
	const currentStartProcPositionY = currentProcedure.hour
		* userProcedures.hourHeightInPx - ProcConfig.START_WORK_TIME * userProcedures.hourHeightInPx;
	const currentStartProcPositionYToDate = FormatDate.minutesToDate(
		currentProcedure.hour * 60,
		userProcedures.locale,
		false,
	);
	const isAvailableForAddNewProc = popupName !== "design"
		&& (isVisiblePopup || isMouseDown);
	const formatedStartCurrProc = FormatDate.stringHourAndMin(
		currentStartProcPositionYToDate,
		currentLang,
	);
	const currentFinishProcPositionYToDate = FormatDate.minutesToDate(
		currentProcedure.hour * 60
		+ currentProcedure.type.duration * userProcedures.hourHeightInPx,
		userProcedures.locale,
		false,
	);
	const formatedFinishCurrProc = FormatDate.stringHourAndMin(
		currentFinishProcPositionYToDate,
		currentLang,
	);
	const currentStirngHoursAndMinutes = FormatDate.stringHourAndMin(
		userProcedures.locale,
		currentLang,
	);

	function setNumericTimeByGrabbing(e, pageY) { //!
		const topToRootEl = parentRef.current.offsetTop;
		const time = (pageY
			- Math.ceil((topToRootEl + e.currentTarget.parentNode.offsetTop) / 60) * 60)
			/ userProcedures.hourHeightInPx;

		const isIt = AllProceduresHelper.isTouchCard(
			time + ProcConfig.START_WORK_TIME,
			userProcedures,
		);

		if (isIt) {
			return currentProcedure.hour;
		}

		let rez = time;

		if (userProcedures.minDayTime - ProcConfig.START_WORK_TIME > time) {
			rez = userProcedures.minDayTime - ProcConfig.START_WORK_TIME;
		} else if (userProcedures.maxDayTime - currentProcedure.type.duration < time) {
			rez = userProcedures.maxDayTime - currentProcedure.type.duration;
		}

		dispatch(actions.changeHour(rez));

		return currentProcedure.hour;
	}

	function onMouseUp(e) {
		const y = UserProceduresHelper.getDragY(e.pageY, userProcedures);
		const minutesByMouseUp = setNumericTimeByGrabbing(e, y) * 60;

		setMouseDown(false);
		setVisiblePopup(!userProcedures.isPrevTime);

		if (minutesByMouseUp === userProcedures.currentTimeHeightInPx) {
			window.scrollTo(0, minutesByMouseUp);
		}
	}

	function onMouseMove(e) {
		if (!isMouseDown) {
			return;
		}

		const y = UserProceduresHelper.getDragY(e.pageY, userProcedures);

		setNumericTimeByGrabbing(e, y);
	}

	function onMouseDown(e) {
		if (!isAuth) {
			navigate("/signin", {
				state: {
					purpose: "warningAuthToMakeAppointment",
				},
			});
			return;
		}

		const y = UserProceduresHelper.getDragY(e.pageY, userProcedures);

		setNumericTimeByGrabbing(e, y);

		setMouseDown(!userProcedures.isPrevTime);
		setVisiblePopup(false);
	}

	return (
		// The <div> is a parent element which has events for grabbing certain card
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<div
			ref={parentRef}
			className={`${style.cards} ${classNameByPresentState}`}
			style={{
				height: (ProcConfig.FINISH_WORK_TIME - ProcConfig.START_WORK_TIME)
					* userProcedures.hourHeightInPx,
			}}
			onMouseUp={onMouseUp}
			onMouseMove={onMouseMove}
			onMouseDown={onMouseDown}
		>
			<div
				id={style.elapsedTime}
				style={{
					height: `${userProcedures.currentTimeHeightInPx}px`,
				}}
			>
				{userProcedures.isCurrentTime && (
					<div id={style.current}>
						<span className={style.time}>{currentStirngHoursAndMinutes}</span>
					</div>
				)}
			</div>
			{isAvailableForAddNewProc && (
				<Card
					start={formatedStartCurrProc}
					finish={formatedFinishCurrProc}
					isSelected
					isExists={false}
					className={style.newProcedure}
					procedure={currentProcedure}
					styleAttr={{
						height: `${currentProcedure.type.duration * userProcedures.hourHeightInPx}px`,
						top: `${currentStartProcPositionY}px`,
					}}
				/>
			)}
			{
				userProcedures.newProcedures.map(([card, isSelected], i) => {
					const top = (card.hour - ProcConfig.START_WORK_TIME) * userProcedures.hourHeightInPx;
					let isAvailableRender = false;

					const {
						isCurrent,
					} = UserProceduresHelper.dateDirection(card.startProcTime, currentProcedure);

					if (isCurrent) {
						isAvailableRender = !isSelected && isCurrent;
					}

					const start = FormatDate.stringHourAndMin(card.startProcTime, currentLang);
					const finish = FormatDate.stringHourAndMin(card.finishProcTime, currentLang);

					return isAvailableRender && (
						<Card
							start={start}
							finish={finish}
							key={`${card.type.name}/${top}/newProcedures`}
							isExists={false}
							onMouseDown={() => {
								dispatch(actions.switchCurrentProc(i));
								changePopupName("edit");
							}}
							className={style.newProcedure}
							procedure={card}
							styleAttr={{
								height: `${card.type.duration * userProcedures.hourHeightInPx}px`,
								top: `${top}px`,
							}}
						/>
					);
				})
			}
			{allProcedures.cards.map((card) => {
				const top = (card.hour - ProcConfig.START_WORK_TIME) * userProcedures.hourHeightInPx;

				const start = FormatDate.stringHourAndMin(card.startProcTime, currentLang);
				const finish = FormatDate.stringHourAndMin(card.finishProcTime, currentLang);

				return (
					<Card
						start={start}
						finish={finish}
						key={`${card.type.name}/${card.startProcTime}/allProcedures`}
						procedure={card}
						styleAttr={{
							height: `${card.type.duration * userProcedures.hourHeightInPx}px`,
							top: `${top}px`,
						}}
					/>
				);
			})}
		</div>
	);
}

export default Cards;