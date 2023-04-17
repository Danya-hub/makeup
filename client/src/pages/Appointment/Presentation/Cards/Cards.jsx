import { useContext, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import types from "prop-types";

import FormatDate from "@/utils/formatDate.js";
import PropsContext from "@/pages/Appointment/context.js";
import LangContext from "@/context/lang.js";
import { actions } from "@/service/redusers/userProcedures.js";
import ProcConfig from "@/config/procedures.js";
import AllProceduresHelper from "@/service/helpers/allProcedures.js";
import UserProceduresHelper from "@/service/helpers/userProcedures.js";

import Card from "@/pages/Appointment/Card/Card.jsx";

import style from "./Cards.module.css";

function Cards({
	widthCharTime,
}) {
	const dispatch = useDispatch();
	const { allProcedures, userProcedures } = useSelector((state) => state);
	const {
		changePopupNameState: [popupName, changePopupName],
		visiblePopupState: [isVisiblePopup, setVisiblePopup],
		mouseDownState: [isMouseDown, setMouseDown],
		visibledGroupProcedures: [visibledGroup],
	} = useContext(PropsContext);
	const [{
		currentLang,
	}] = useContext(LangContext);
	const navigate = useNavigate();
	const parentRef = useRef(null);

	const [currentProcedure] = userProcedures.currentProcedure;
	const classNameByPresentState = (isVisiblePopup && "noActiveGrabbing") || (isMouseDown && "activeGrabbing") || "";
	const isAuth = localStorage.getItem("token");
	const currentStartProcPositionY = currentProcedure.hour
		* userProcedures.hourHeightInPx - ProcConfig.START_WORK_TIME * userProcedures.hourHeightInPx;
	const currentStartProcPositionYToDate = FormatDate.minutesToDate(
		currentProcedure.hour * userProcedures.hourHeightInPx,
		userProcedures.locale,
	);
	const availableForOpen = (popupName !== "design"
		&& ((isVisiblePopup && userProcedures.availableDateTime.length > 0)
			|| isMouseDown));
	const currentStirngHoursAndMinutes = FormatDate.stringHourAndMin(
		userProcedures.locale,
		currentLang,
	);
	const showAvailableCursor = userProcedures.isCurrentTime
		&& (userProcedures.currentTimeHeightInPx / userProcedures.hourHeightInPx
			+ ProcConfig.START_WORK_TIME) < ProcConfig.FINISH_WORK_TIME;

	function setNumericTimeByGrabbing(e, pageY) {
		const time = (pageY
			- Math.ceil((parentRef.current.offsetTop + e.currentTarget.parentNode.offsetTop)
				/ userProcedures.hourHeightInPx) * userProcedures.hourHeightInPx)
			/ userProcedures.hourHeightInPx;

		const isIt = AllProceduresHelper.isTouchCardBySelectedTime(
			time + ProcConfig.START_WORK_TIME,
			currentProcedure.type.duration,
			userProcedures,
		);

		if (isIt) {
			return;
		}

		let rez = time;

		if (userProcedures.minDayTime > time + ProcConfig.START_WORK_TIME) {
			rez = userProcedures.minDayTime - ProcConfig.START_WORK_TIME;
		} else if (userProcedures.maxDayTime - currentProcedure.type.duration < time
			+ ProcConfig.START_WORK_TIME) {
			rez = userProcedures.maxDayTime - ProcConfig.START_WORK_TIME - currentProcedure.type.duration;
		}

		dispatch(actions.changeHour(rez));
	}

	function onMouseUp(e) {
		setVisiblePopup(true);

		if (!userProcedures.availableDateTime.length) {
			return;
		}

		const y = UserProceduresHelper.getDragY(e.pageY, userProcedures);
		setNumericTimeByGrabbing(e, y);

		const minutesOnMouseUp = currentProcedure.hour * userProcedures.hourHeightInPx
			- ProcConfig.START_WORK_TIME;

		setMouseDown(false);

		if (minutesOnMouseUp === userProcedures.currentTimeHeightInPx) {
			window.scrollTo(0, minutesOnMouseUp);
		}
	}

	function onMouseMove(e) {
		if (!isMouseDown || !userProcedures.availableDateTime.length) {
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

		setVisiblePopup(false);

		if (!userProcedures.availableDateTime.length) {
			return;
		}

		const y = UserProceduresHelper.getDragY(e.pageY, userProcedures);

		setNumericTimeByGrabbing(e, y);
		setMouseDown(!userProcedures.isPrevTime);
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
				width: `calc(100% - ${widthCharTime}px)`,
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
				{showAvailableCursor && (
					<div id={style.current}>
						<span className={style.time}>{currentStirngHoursAndMinutes}</span>
					</div>
				)}
			</div>
			{availableForOpen && (
				<Card
					date={currentStartProcPositionYToDate}
					isSelected
					isExists={false}
					className={`${style.newProcedure} ${style.currentCard}`}
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

					return isAvailableRender && (
						<Card
							date={card.startProcTime}
							key={`${card.type.name}/${top}/newProcedures`}
							isExists={false}
							onMouseDown={() => {
								dispatch(actions.switchCurrentProc(i));
								changePopupName("edit");
							}}
							className={`${style.newProcedure} ${style[visibledGroup.myAppointments]}`}
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

				return (
					<Card
						className={style[visibledGroup.otherAppointments]}
						date={card.startProcTime}
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

Cards.propTypes = {
	widthCharTime: types.number.isRequired,
};

export default Cards;