import { useLocation } from "react-router-dom";
import { useState, useLayoutEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
	getProcedureByDay,
	getAllTypes,
	getAllStates,
	getDefaultProcValue,
} from "@/service/redusers/procedures.js";
import useCalendar from "@/hooks/useCalendar.js";
import FormatDate from "@/utils/formatDate.js";
import Value from "@/helpers/value.js";
import Check from "@/helpers/check.js";

import ProcPopup from "./ProcPopup/ProcPopup.jsx";
import ControlPanel from "./ControlPanel/ControlPanel.jsx";
import Presentation from "./Presentation/Presentation.jsx";

import style from "./AllProcedures.module.css";

function AllProcedures() {
	const { procedures } = useSelector((state) => state);
	const dispatch = useDispatch();
	const calendar = new useCalendar();
	const { state: locationState } = useLocation();

	const [newProcedure, setNewProcedure] = useState({});
	const [isVisibleProcedurePopup, setVisibleProcedurePopup] = useState(
		locationState?.isVisiblePopup
	);
	const defaultValueProcedure = useRef(null);
	const isInitialProcedureLoading = Check.onEmpty(newProcedure);

	class Event {
		constructor() {
			this.onCrossingElapsedTime = (minutes) => {
				calendar.warning.setWarning([
					"crossingElapsedTime",
					calendar.currentTimeHeightInPx > minutes ? "crossingElapsedTime" : "",
				]);
			};

			this.onTouchCard = (newProcStartMinutes, newProcFinishMinutes) => {
				let isTouchCard = false;

				procedures.cards.forEach((card) => {
					if (isTouchCard) {
						return;
					}

					const numericStartHours = FormatDate.numericHoursFromDate(card.startProcTime);
					const startSegment = (numericStartHours - newProcedure.type.durationProc) * 60,
						finishSegment =
							numericStartHours * 60 +
							(card.type.durationProc + newProcedure.type.durationProc) * 60;

					isTouchCard =
						(startSegment < newProcStartMinutes && finishSegment > newProcFinishMinutes) ||
						(newProcStartMinutes < startSegment && newProcFinishMinutes > finishSegment);

					calendar.warning.setWarning([
						"takenProcedureTime",
						isTouchCard ? "takenProcedureTime" : "",
					]);
				});
			};
		}
	}

	const events = new Event();

	async function __init__() {
		dispatch(getProcedureByDay(calendar.viewState.locale));
		dispatch(getAllTypes());
		dispatch(getAllStates());

		defaultValueProcedure.current = await dispatch(getDefaultProcValue()).then(
			(res) => res.payload
		);

		Value.changeObject(defaultValueProcedure.current, setNewProcedure);
	}

	function handleChangeDate(date) {
		const { newDate, isElapsed } = calendar.switchDayOnOther(date);

		dispatch(getProcedureByDay(newDate));

		if (isElapsed) {
			return;
		}

		Value.changeObject(
			calendar.setUnitForDate(
				["Time"],
				{
					startProcTime: newProcedure.startProcTime,
					finishProcTime: newProcedure.finishProcTime,
				},
				newDate
			),
			setNewProcedure
		);
	}

	useLayoutEffect(() => {
		return __init__;
	}, []);

	return (
		<div id={style.allProcedures}>
			<ControlPanel
				newProcedureState={[newProcedure, setNewProcedure]}
				handleChangeDate={handleChangeDate}
				{...calendar}
			></ControlPanel>
			<Presentation
				cards={procedures.cards}
				visiblePopupState={[isVisibleProcedurePopup, setVisibleProcedurePopup]}
				newProcedureState={[newProcedure, setNewProcedure]}
				handleChangeDate={handleChangeDate}
				isLoadingContent={procedures.isLoading || isInitialProcedureLoading}
				{...events}
				{...calendar}
			></Presentation>
			<ProcPopup
				defaultValueProcedure={defaultValueProcedure}
				visibleState={[isVisibleProcedurePopup, setVisibleProcedurePopup]}
				newProcedureState={[newProcedure, setNewProcedure]}
				handleChangeDate={handleChangeDate}
				{...events}
				{...calendar}
			></ProcPopup>
		</div>
	);
}

export { AllProcedures as default };
