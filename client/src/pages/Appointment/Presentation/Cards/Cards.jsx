import { useContext, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import types from "prop-types";

import FormatDate from "@/utils/formatDate.js";
import PropsContext from "@/pages/Appointment/context/context.js";
import GlobalContext from "@/context/global.js";
import { actions, asyncActions } from "@/service/redusers/userProcedures.js";
import ProcConfig from "@/config/procedures.js";
import UserProceduresHelper from "@/service/helpers/userProcedures.js";

import Card from "@/pages/Appointment/components/Card/Card.jsx";

import style from "./Cards.module.css";

function Cards({
	widthCharTime,
}) {
	const dispatch = useDispatch();
	const { userProcedures, user } = useSelector((state) => state);
	const {
		isMouseDown,
		setMouseDownState,
		visibledGroups,
	} = useContext(PropsContext);
	const {
		currentLang,
		popup: [popupName],
		setPopup,
		isVisiblePopup,
		setVisiblePopup,
		isAuth,
	} = useContext(GlobalContext);
	const navigate = useNavigate();

	const parentRef = useRef(null);

	const [currentProcedure] = userProcedures.currentProcedure;
	const classNameByPresentState = (isVisiblePopup && "noActiveGrabbing") || (isMouseDown && "activeGrabbing") || "";
	const currentStartProcPositionY = (currentProcedure.hour - ProcConfig.START_WORK_TIME)
		* userProcedures.hourHeightInPx;
	const currentStartProcPositionYToDate = FormatDate.minutesToDate(
		currentProcedure.hour * userProcedures.hourHeightInPx,
		userProcedures.locale,
	);
	const availableForOpen = (
		(popupName === "make" || popupName === "edit")
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

		dispatch(actions.changeHour(time));
	}

	function onMouseUp(e) {
		if (e.target.tagName === "BUTTON") {
			return;
		}

		setVisiblePopup(true);

		if (!userProcedures.availableDateTime.length) {
			return;
		}

		const y = UserProceduresHelper.getDragY(e.pageY, userProcedures);
		setNumericTimeByGrabbing(e, y);

		const minutesOnMouseUp = currentProcedure.hour * userProcedures.hourHeightInPx
			- ProcConfig.START_WORK_TIME;

		setMouseDownState(false);

		if (minutesOnMouseUp === userProcedures.currentTimeHeightInPx) {
			window.scrollTo(0, minutesOnMouseUp);
		}
	}

	function onMouseMove(e) {
		if (!isMouseDown
			|| !userProcedures.availableDateTime.length
			|| e.target.tagName === "BUTTON") {
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

		if (e.target.tagName === "BUTTON") {
			return;
		}

		setVisiblePopup(false);

		if (!popupName) {
			setPopup(["make", null]);
		}

		if (!userProcedures.availableDateTime.length) {
			return;
		}

		const y = UserProceduresHelper.getDragY(e.pageY, userProcedures);

		setNumericTimeByGrabbing(e, y);
		setMouseDownState(!userProcedures.isPrevTime);
	}

	async function onCloseEditPopup(res, index) {
		await dispatch(asyncActions.updateProc([res, true]));
		dispatch(actions.deleteProc(index));
		dispatch(actions.updateCurrProc([
			[userProcedures.defaultProcedure, userProcedures.newProcedures.length],
			false,
		]));
	}

	function handleDeleteProc(id) {
		dispatch(asyncActions.deleteProc(id));
	}

	function handleEditProc(index) {
		dispatch(actions.updateCurrProc([
			[userProcedures.proceduresByDay[index], userProcedures.newProcedures.length],
			false,
		]));
		dispatch(actions.updateAvailableTimeByDate(false));
		setPopup(["edit", {
			delete: (res) => handleDeleteProc(res.id),
			edit: (res) => onCloseEditPopup(res, index),
		}]);
		setVisiblePopup(true);
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
							isOwn
							index={i}
							date={card.startProcTime}
							key={`${card.type.name}/${top}/newProcedures`}
							isExists={false}
							className={`${style.newProcedure} ${style[visibledGroups.myAppointments]}`}
							procedure={card}
							styleAttr={{
								height: `${card.type.duration * userProcedures.hourHeightInPx}px`,
								top: `${top}px`,
							}}
							onDelete={(index) => {
								dispatch(actions.deleteProc(index));

								if (userProcedures.newProcedures.length - 1 === 0) {
									setPopup(["make", null]);
								}
							}}
							onEdit={(index) => {
								dispatch(actions.switchCurrentProc(index));
								setVisiblePopup(true);
								setPopup(["edit", null]);
							}}
						/>
					);
				})
			}
			{userProcedures.proceduresByDay.map((card, i) => {
				const top = (card.hour - ProcConfig.START_WORK_TIME) * userProcedures.hourHeightInPx;
				const isOwn = card.user.id === user.info?.id;

				const isAvailableRender = currentProcedure.id !== card.id;

				return isAvailableRender && (
					<Card
						index={card.id}
						isOwn={isOwn}
						isBook={isOwn}
						className={style[isOwn
							? visibledGroups.myAppointments
							: visibledGroups.otherAppointments]}
						date={card.startProcTime}
						key={`${card.type.name}/${card.startProcTime}/allProcedures`}
						procedure={card}
						styleAttr={{
							height: `${card.type.duration * userProcedures.hourHeightInPx}px`,
							top: `${top}px`,
						}}
						onDelete={handleDeleteProc}
						onEdit={() => handleEditProc(i)}
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