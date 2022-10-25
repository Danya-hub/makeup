import { useState, useLayoutEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
	getProcedureByDay,
	getAllStates,
	getAllTypes,
	getDefaultProcValue,
} from "@/service/redusers/allProcedures.js";
import useCalendar from "@/hooks/useCalendar.js";
import FormatDate from "@/utils/formatDate.js";

import ProcPopup from "./ProcPopup/ProcPopup.jsx";
import ControlPanel from "./ControlPanel/ControlPanel.jsx";
import Presentation from "./Presentation/Presentation.jsx";

import style from "./AllProcedures.module.css";

function AllProcedures() {
	const { allProcedures } = useSelector((state) => state);
	const dispatch = useDispatch();
	const calendar = new useCalendar();

	const [newProcedure, setNewProcedure] = useState({});
	const [isVisibleProcedurePopup, setVisibleProcedurePopup] = useState(false);
	const defaultValueProcedure = useRef(null);

	class Event {
		constructor() {
			this.onCrossingElapsedTime = (minutes) => {
				calendar.warning.setWarning([
					"crossingElapsedTime",
					calendar.currentTimeHeightInPx > minutes ? "crossingElapsedTime" : "",
				]);
			};

			this.onTouchCart = (newProcStartMinutes, newProcFinishMinutes) => {
				let isTouchCart = false;

				allProcedures.carts.forEach((cart) => {
					if (isTouchCart) {
						return;
					}

					const numericStartHours = FormatDate.numericHoursFromDate(cart.startProcTime);
					const startSegment = (numericStartHours - newProcedure.type.durationProc) * 60,
						finishSegment =
							numericStartHours * 60 +
							(cart.type.durationProc + newProcedure.type.durationProc) * 60;

					isTouchCart =
						(startSegment < newProcStartMinutes && finishSegment > newProcFinishMinutes) ||
						(newProcStartMinutes < startSegment && newProcFinishMinutes > finishSegment);

					calendar.warning.setWarning([
						"takenProcedureTime",
						isTouchCart ? "takenProcedureTime" : "",
					]);
				});
			};
		}
	}

	const events = new Event();

	async function __init__() {
		dispatch(getProcedureByDay(calendar.viewState.locale));
		dispatch(getAllStates());
		dispatch(getAllTypes());

		defaultValueProcedure.current = await dispatch(getDefaultProcValue()).then(
			(res) => res.payload
		);

		setNewProcedure((prev) => ({
			...prev,
			...defaultValueProcedure.current,
		}));
	}

	function handleChangeDate(date) {
		const { newDate, isElapsed } = calendar.switchDayOnOther(date);

		dispatch(getProcedureByDay(newDate));

		if (isElapsed) {
			return;
		}

		setNewProcedure((prev) => ({
			...prev,
			...calendar.setUnitForDate(
				["Time"],
				{
					startProcTime: newProcedure.startProcTime,
					finishProcTime: newProcedure.finishProcTime,
				},
				newDate
			),
		}));
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
				carts={allProcedures.carts}
				isLoadingContent={allProcedures.isLoading.procedures}
				visiblePopupState={[isVisibleProcedurePopup, setVisibleProcedurePopup]}
				newProcedureState={[newProcedure, setNewProcedure]}
				handleChangeDate={handleChangeDate}
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
