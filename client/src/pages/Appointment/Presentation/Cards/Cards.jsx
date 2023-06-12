/* eslint-disable react/prop-types */

import { useContext, useRef, forwardRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import FormatDate from "@/utils/formatDate.js";
import PropsContext from "@/pages/Appointment/context/context.js";
import GlobalContext from "@/context/global.js";
import { actions, asyncActions } from "@/service/redusers/appointments.js";
import ProcConfig from "@/config/procedures.js";
import AppointmentsHelper from "@/service/helpers/appointments.js";

import Card from "@/pages/Appointment/components/Card/Card.jsx";

import style from "./Cards.module.css";

function Cards({
	widthCharTime,
}, parentRef) {
	const dispatch = useDispatch();
	const { appointments, user } = useSelector((state) => state);
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
	const { current: parentElement } = parentRef;

	const childRef = useRef(null);

	const [currentProcedure] = appointments.currentProcedure;
	const classNameByPresentState = (isVisiblePopup && "noActiveGrabbing") || (isMouseDown && "activeGrabbing") || "";
	const currentStartProcPositionY = (currentProcedure.hour - ProcConfig.START_WORK_TIME)
		* appointments.hourHeightInPx;
	const currentStartProcPositionYToDate = FormatDate.minutesToDate(
		currentProcedure.hour * appointments.hourHeightInPx,
		appointments.locale,
	);
	const availableForOpen = (
		(popupName === "make" || popupName === "edit")
		&& ((isVisiblePopup && appointments.availableDateTime.length > 0)
			|| isMouseDown));
	const currentStirngHoursAndMinutes = FormatDate.stringHourAndMin(
		appointments.locale,
		currentLang,
	);
	const showAvailableCursor = appointments.isCurrentTime
		&& (appointments.currentTimeHeightInPx / appointments.hourHeightInPx
			+ ProcConfig.START_WORK_TIME) < ProcConfig.FINISH_WORK_TIME;

	function setNumericTimeByGrabbing(e, pageY) {
		const time = (pageY
			- Math.ceil((childRef.current.offsetTop + parentElement.offsetTop)
					/ appointments.hourHeightInPx) * appointments.hourHeightInPx)
			/ appointments.hourHeightInPx;

		dispatch(actions.changeHour(time));
	}

	function handleMouseUp(e) {
		if (e.target.tagName === "BUTTON") {
			return;
		}

		setVisiblePopup(true);

		if (!appointments.availableDateTime.length) {
			return;
		}

		const y = AppointmentsHelper.getDragY(e.pageY, appointments);
		setNumericTimeByGrabbing(e, y);

		const minutesOnMouseUp = currentProcedure.hour * appointments.hourHeightInPx
			- ProcConfig.START_WORK_TIME;

		setMouseDownState(false);

		if (minutesOnMouseUp === appointments.currentTimeHeightInPx) {
			window.scrollTo(0, minutesOnMouseUp);
		}
	}

	function handleMouseMove(e) {
		if (!isMouseDown
			|| !appointments.availableDateTime.length
			|| e.target.tagName === "BUTTON") {
			return;
		}

		const y = AppointmentsHelper.getDragY(e.pageY, appointments);

		setNumericTimeByGrabbing(e, y);
	}

	function handleMouseDown(e) {
		if (e.target.tagName === "BUTTON") {
			return;
		}

		if (!isAuth) {
			navigate("/signin", {
				state: {
					purpose: "warningAuthToMakeAppointment",
				},
			});
			return;
		}

		setVisiblePopup(false);

		if (!popupName) {
			setPopup(["make", null]);
		}

		if (!appointments.availableDateTime.length) {
			return;
		}

		const y = AppointmentsHelper.getDragY(e.pageY, appointments);

		setNumericTimeByGrabbing(e, y);
		setMouseDownState(!appointments.isPrevTime);
	}

	async function onCloseEditPopup(res, index) {
		await dispatch(asyncActions.updateProc([res, true]));
		dispatch(actions.deleteProc(index));
		dispatch(actions.updateCurrProc([
			[appointments.defaultProcedure, appointments.newProcedures.length],
			false,
		]));
	}

	function handleDeleteProc(id) {
		dispatch(asyncActions.deleteProc(id));
	}

	function handleEditProc(index) {
		dispatch(actions.updateCurrProc([
			[appointments.proceduresByDay[index], appointments.newProcedures.length],
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
			ref={childRef}
			className={`${style.cards} ${classNameByPresentState}`}
			style={{
				height: (ProcConfig.FINISH_WORK_TIME - ProcConfig.START_WORK_TIME)
					* appointments.hourHeightInPx,
				width: `calc(100% - ${widthCharTime}px)`,
			}}
			onMouseUp={handleMouseUp}
			onMouseMove={handleMouseMove}
			onMouseDown={handleMouseDown}
		>
			<div
				id={style.elapsedTime}
				style={{
					height: `${appointments.currentTimeHeightInPx}px`,
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
						height: `${currentProcedure.type.duration * appointments.hourHeightInPx}px`,
						top: `${currentStartProcPositionY}px`,
					}}
				/>
			)}
			{
				appointments.newProcedures.map(([card, isSelected], i) => {
					const top = (card.hour - ProcConfig.START_WORK_TIME) * appointments.hourHeightInPx;
					let isAvailableRender = false;

					const {
						isCurrent,
					} = AppointmentsHelper.dateDirection(card.startProcTime, currentProcedure);

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
								height: `${card.type.duration * appointments.hourHeightInPx}px`,
								top: `${top}px`,
							}}
							onDelete={(index) => {
								dispatch(actions.deleteProc(index));

								if (appointments.newProcedures.length - 1 === 0) {
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
			{appointments.proceduresByDay.map((card, i) => {
				const top = (card.hour - ProcConfig.START_WORK_TIME) * appointments.hourHeightInPx;
				const isOwn = card.user.id === user.info?.id;

				const isAvailableRender = currentProcedure.id !== card.id;

				return isAvailableRender && (
					<Card
						index={card.id}
						isOwn={isOwn}
						isBook
						className={style[isOwn
							? visibledGroups.myAppointments
							: visibledGroups.otherAppointments]}
						date={card.startProcTime}
						key={`${card.type.name}/${card.startProcTime}/allProcedures`}
						procedure={card}
						styleAttr={{
							height: `${card.type.duration * appointments.hourHeightInPx}px`,
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

export default forwardRef(Cards);