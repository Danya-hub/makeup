import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import useDate from "@/hooks/date.js";
import useWarning from "@/hooks/warning.js";
import {
	getProcedureByDay,
	getAllStates,
	getAllTypes,
	getDefaultProcValue,
} from "@/service/redusers/procedure.js";
import FormatDate from "@/utils/formatDate.js";

import ProcPopup from "./ProcPopup/ProcPopup.jsx";
import Aside from "./Aside/Aside.jsx";
import Presentation from "./Presentation/Presentation.jsx";

import style from "./Procedure.module.css";

const warningsList = {
	takenProcedureTime: "",
	elapsedDay: "",
	crossingElapsedTime: "",
};

function Procedure() {
	const { navigateDate, langs, procedure } = useSelector((state) => state);
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const [warnings, setWarning, { hasWarning }] = useWarning(warningsList);
	const [{ noChangeDate }] = useDate(new Date(navigateDate.date));
	const [newProcedure, setNewProcedure] = useState({});
	const [view, setViewDate] = useState(new Date());
	const [isVisibleProcedurePopup, setVisibleProcedurePopup] = useState(false);
	const defaultValueProcedure = useRef(null);

	class CommonProps {
		warning = {
			warnings,
			setWarning,
			hasWarning,
		};

		constructor() {
			this.newProcedure = [newProcedure, setNewProcedure];
			this.locale = new Date(navigateDate.date);
			this.isCurrentTime = navigateDate.isCurrentDate;
			this.view = [view, setViewDate];
			this.hourHeightInPx = window.screen.height / 12;

			this.numericHoursFromDay = FormatDate.hoursByFormat({
				hourFormat: langs.currLng,
			});
			this.currentTimeHeightInPx = FormatDate.minutesFromDate(view, this.hourHeightInPx);
			this.minHour = this.currentTimeHeightInPx / this.hourHeightInPx;
			this.maxHour =
				(this.hourHeightInPx * (this.numericHoursFromDay.length - 1)) / this.hourHeightInPx;

			this.minDate = (date) => {
				return FormatDate.minutesInDate(0, date, false);
			};

			this.maxDate = (date) => {
				return FormatDate.minutesInDate(this.maxHour * 60 - 1, date, false);
			};

			this.switchDayOnOther = (date) => {
				const [newDay, isCurrent] = formatViewDateByDay(date);

				setNewProcedure((prev) => ({
					...prev,
					...this.setUnitForDate(["Date"], ["startProcTime", "finishProcTime"], date),
				}));

				setViewDate(newDay);
				dispatch(getProcedureByDay(newDay));

				return [newDay, isCurrent];
			};

			this.setUnitForDate = (unitArr, fieldNameArr, date) => {
				const rez = {};

				fieldNameArr.forEach((name) => {
					rez[name] = FormatDate.unitTimeFromOtherDate(unitArr, newProcedure[name], date);
				});

				return rez;
			};

			this.isElapsedDay = (minutes) =>
				commonProps.maxHour ===
				Math.floor(((minutes || commonProps.currentTimeHeightInPx) + 1) / 60);
		}
	}

	class Event {
		constructor() {
			this.onCrossingElapsedTime = (minutes) => {
				commonProps.warning.setWarning([
					"crossingElapsedTime",
					commonProps.currentTimeHeightInPx > minutes ? t("crossingElapsedTime") : "",
				]);
			};

			this.onTouchCart = (newProcStartMinutes, newProcFinishMinutes) => {
				let isTouchCart = false;

				procedure.carts.forEach((cart) => {
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

					commonProps.warning.setWarning([
						"takenProcedureTime",
						isTouchCart ? t("takenProcedureTime") : "",
					]);
				});
			};

			this.onElapsedDay = (date) => {
				let selectMinutes = null;

				if (date) {
					const [newDay] = formatViewDateByDay(date);

					selectMinutes = FormatDate.minutesFromDate(newDay, commonProps.hourHeightInPx);
				}

				const isEquil = commonProps.isElapsedDay(selectMinutes);

				commonProps.warning.setWarning(["elapsedDay", isEquil ? t("elapsedDay") : ""]);

				return isEquil;
			};
		}
	}

	const commonProps = new CommonProps();
	const events = new Event();

	function formatViewDateByDay(date) {
		const callback = FormatDate.dayFormatFromCurrentTime(({ isCurrent, isMaxDate, date }) =>
			isCurrent ? [new Date(), true] : [commonProps[isMaxDate ? "maxDate" : "minDate"](date), false]
		);

		return callback(date, noChangeDate);
	}

	function __init__() {
		dispatch(getAllStates());
		dispatch(getAllTypes());

		defaultValueProcedure.current = dispatch(getDefaultProcValue()).then((res) => res.payload);

		setNewProcedure((prev) => ({
			...prev,
			...defaultValueProcedure.current,
		}));
	}

	useLayoutEffect(() => {
		return __init__;
	}, []);

	useEffect(() => {
		document.body.style.overflowY = isVisibleProcedurePopup ? "hidden" : "scroll";
	}, [isVisibleProcedurePopup]);

	return (
		<div id={style.procedure}>
			<ProcPopup
				defaultValueProcedure={defaultValueProcedure}
				isVisible={[isVisibleProcedurePopup, setVisibleProcedurePopup]}
				{...events}
				{...commonProps}
			></ProcPopup>
			<Aside {...commonProps}></Aside>
			<Presentation
				carts={procedure.carts}
				isVisiblePopup={[isVisibleProcedurePopup, setVisibleProcedurePopup]}
				isLoadingContent={procedure.isLoading.procedure}
				formatViewDateByDay={formatViewDateByDay}
				{...events}
				{...commonProps}
			></Presentation>
		</div>
	);
}

export { Procedure as default };
