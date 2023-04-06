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
		false,
	);
	const availableNextAction = (popupName !== "design"
		&& ((isVisiblePopup && userProcedures.availableTime.length > 0)
			|| isMouseDown));
	const currentFinishProcPositionYToDate = FormatDate.minutesToDate(
		currentProcedure.hour * userProcedures.hourHeightInPx
		+ currentProcedure.type.duration * userProcedures.hourHeightInPx,
		userProcedures.locale,
		false,
	);
	const formatedStartCurrProc = FormatDate.stringHourAndMin(
		currentStartProcPositionYToDate,
		currentLang,
	);
	const formatedFinishCurrProc = FormatDate.stringHourAndMin(
		currentFinishProcPositionYToDate,
		currentLang,
	);
	const currentStirngHoursAndMinutes = FormatDate.stringHourAndMin(
		userProcedures.locale,
		currentLang,
	);

	function setNumericTimeByGrabbing(e, pageY) {
		const time = (pageY
			- Math.ceil((parentRef.current.offsetTop + e.currentTarget.parentNode.offsetTop)
			/ userProcedures.hourHeightInPx) * userProcedures.hourHeightInPx)
			/ userProcedures.hourHeightInPx;

		const isIt = AllProceduresHelper.isTouchCard(
			time + ProcConfig.START_WORK_TIME,
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
		if (!userProcedures.availableTime.length) {
			return;
		}

		const y = UserProceduresHelper.getDragY(e.pageY, userProcedures);
		setNumericTimeByGrabbing(e, y);

		const minutesOnMouseUp = currentProcedure.hour * userProcedures.hourHeightInPx
			- ProcConfig.START_WORK_TIME;

		setMouseDown(false);
		setVisiblePopup(!userProcedures.isPrevTime);

		if (minutesOnMouseUp === userProcedures.currentTimeHeightInPx) {
			window.scrollTo(0, minutesOnMouseUp);
		}
	}

	function onMouseMove(e) {
		if (!isMouseDown || !userProcedures.availableTime.length) {
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

		if (!userProcedures.availableTime.length) {
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
				{userProcedures.isCurrentTime && (
					<div id={style.current}>
						<span className={style.time}>{currentStirngHoursAndMinutes}</span>
					</div>
				)}
			</div>
			{availableNextAction && (
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

Cards.propTypes = {
	widthCharTime: types.number.isRequired,
};

export default Cards;