import { useLocation } from "react-router-dom";
import { useState, useRef, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	getProcedureByDay,
	getAllTypes,
	getAllStates,
	getDefaultProcValue,
} from "@/service/redusers/procedures.js";
import useCalendar from "@/hooks/useCalendar.js";

import FormatDate from "@/utils/formatDate.js";
import ProcPopup from "./ProcPopup/ProcPopup.jsx";
import ControlPanel from "./ControlPanel/ControlPanel.jsx";
import Presentation from "./Presentation/Presentation.jsx";
import SimpleLoader from "@/components/UI/SimpleLoader/SimpleLoader.jsx";

import PropsContext from "./context.js";
import { DEFAULT_POPUP_NAME } from "@/pages/AllProcedures/constants.js";

import style from "./AllProcedures.module.css";

function AllProcedures() {
	const { procedures } = useSelector((state) => state);
	const dispatch = useDispatch();
	const { state: locationState } = useLocation();
	const calendar = useCalendar.call({});

	const [newProcedures, setNewProcedure] = useState([]);
	const [[currProcedure, indexSelectedProcedure], setCurrProcedure] = useState([]);
	const [isVisibleProcedurePopup, setVisibleProcedurePopup] = useState(
		Boolean(locationState?.isVisiblePopup),
	);
	const defaultValueProcedure = useRef(null);
	const [selectTime, setSelectTime] = useState(calendar.minHour);
	const [popupName, changePopupName] = useState(DEFAULT_POPUP_NAME);

	const events = {
		onCrossingElapsedTime(minutes) {
			calendar.warning.setWarning([
				"crossingElapsedTime",
				calendar.currentTimeHeightInPx > minutes ? "crossingElapsedTime" : "",
			]);
		},

		onTouchCard(newProcStartMinutes, newProcFinishMinutes) {
			let isTouchCard = false;

			procedures.cards.forEach((card) => {
				if (isTouchCard) {
					return;
				}

				const numericStartHours = FormatDate.numericHoursFromDate(card.startProcTime);
				const startSegment = (numericStartHours - currProcedure.type.durationProc) * 60;
				const finishSegment = numericStartHours * 60
				+ (card.type.durationProc + currProcedure.type.durationProc) * 60;

				isTouchCard = (startSegment < newProcStartMinutes && finishSegment > newProcFinishMinutes)
					|| (newProcStartMinutes < startSegment && newProcFinishMinutes > finishSegment);

				calendar.warning.setWarning([
					"takenProcedureTime",
					isTouchCard ? "takenProcedureTime" : "",
				]);
			});
		},
	};

	const procActions = {
		edit(i, proc) {
			setCurrProcedure([proc, i]);
			setNewProcedure((prev) => {
				const array = [...prev];

				array[i][1] = true;

				return array;
			});
			changePopupName("edit");
		},

		delete(i) {
			setCurrProcedure([defaultValueProcedure.current, newProcedures.length - 1]);
			setNewProcedure((prev) => {
				const array = [...prev];

				array.splice(i, 1);

				return array;
			});

			if (newProcedures.length - 1 === 0) {
				changePopupName("make");
			}
		},
	};

	async function init() {
		dispatch(getProcedureByDay(calendar.viewState.locale));
		dispatch(getAllTypes());
		dispatch(getAllStates());

		defaultValueProcedure.current = await dispatch(getDefaultProcValue()).then(
			(res) => res.payload,
		);

		setCurrProcedure([defaultValueProcedure.current, newProcedures.length]);
	}

	function handleChangeDate(date) {
		const { newDate } = calendar.switchDayOnOther(date);

		dispatch(getProcedureByDay(newDate));

		const updatedDates = calendar.setUnitForDate(
			["Time"],
			{
				startProcTime: currProcedure.startProcTime,
				finishProcTime: currProcedure.finishProcTime,
			},
			newDate,
		);

		setCurrProcedure((prev) => {
			const array = [...prev];

			array[0] = {
				...array[0],
				...updatedDates,
			};

			return array;
		});
	}

	function setStartAndFinishTimes(minutes) {
		const startProcMinutes = minutes || selectTime * 60;
		const finishProcMinutes = startProcMinutes + currProcedure.type.durationProc * 60;

		const startProcTime = FormatDate.minutesToDate(
			startProcMinutes,
			calendar.viewState.locale,
			false,
		);
		const finishProcTime = FormatDate.minutesToDate(
			finishProcMinutes,
			calendar.viewState.locale,
			false,
		);

		setCurrProcedure((prev) => {
			const array = [...prev];

			array[0] = {
				...array[0],
				startProcTime,
				finishProcTime,
			};

			return array;
		});

		events.onTouchCard(startProcMinutes, finishProcMinutes);
		const [, _hasWarning] = calendar.warning.checkOnWarning("crossingElapsedTime");

		if (_hasWarning) {
			calendar.warning.setWarning(["crossingElapsedTime", ""]);
		}
	}

	useLayoutEffect(() => init, []);

	// eslint-disable-next-line react/jsx-no-constructed-context-values
	const contextValue = {
		handleChangeDate,
		setStartAndFinishTimes,
		defaultValueProcedure,
		changePopupNameState: [popupName, changePopupName],
		visiblePopupState: [isVisibleProcedurePopup, setVisibleProcedurePopup],
		selectTimeState: [selectTime, setSelectTime],
		newProceduresState: [newProcedures, setNewProcedure],
		currProcedureState: [[currProcedure, indexSelectedProcedure], setCurrProcedure],
		...events,
		...calendar,
		...procActions,
	};

	return (
		<div id={style.allProcedures}>
			<PropsContext.Provider value={contextValue}>
				<ControlPanel />
				{!currProcedure ? (
					<SimpleLoader />
				) : (
					<>
						<Presentation />
						<ProcPopup />
					</>
				)}
			</PropsContext.Provider>
		</div>
	);
}

export default AllProcedures;
