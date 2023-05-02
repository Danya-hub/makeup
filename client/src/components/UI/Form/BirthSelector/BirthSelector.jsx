import { useState, useContext, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import types from "prop-types";

import Check from "@/utils/check.js";

import FormatDate from "@/utils/formatDate.js";
import Select from "@/components/UI/Form/Select/Select.jsx";
import GlobalContext from "@/context/global.js";

import style from "./BirthSelector.module.css";

function BirthSelctor({
	id,
	date,
	className,
	onChange,
}) {
	const { t } = useTranslation();
	const {
		currentLang,
	} = useContext(GlobalContext);

	const currentDate = date || new Date();
	const currentYear = currentDate.getFullYear();
	const currentMonth = currentDate.getMonth();

	const [time, setTime] = useState(() => {
		const availableYears = FormatDate.allYears(currentYear, 100).reverse();
		const availableMonths = FormatDate.allMonthsInYear(currentYear, currentLang);
		const availableDays = FormatDate.allDaysInMonth(
			currentYear,
			currentMonth + 1,
		).filter(Check.isStrictNumber);

		return {
			year: {
				selected: date && availableYears.indexOf(currentYear),
				available: availableYears,
				format: true,
			},
			month: {
				selected: date && currentMonth,
				available: availableMonths,
				format: false,
			},
			day: {
				selected: date && availableDays.indexOf(date.getDate()),
				available: availableDays,
				format: true,
			},
		};
	});
	const selects = useRef([{
		key: "day",
		callback: (ind) => {
			setTime((prev) => {
				const prevState = prev;

				prevState.day.selected = ind;

				return { ...prevState };
			});
		},
	}, {
		key: "month",
		callback: (ind) => {
			setTime((prev) => {
				const prevState = prev;

				prevState.day.available = FormatDate.allDaysInMonth(
					prevState.year.selected,
					ind + 1,
				).filter(Check.isStrictNumber);
				prevState.month.selected = ind;

				if (prevState.day.available[prevState.day.available.length - 1] < prevState.day.selected) {
					prevState.day.selected = null;
				}

				return { ...prevState };
			});
		},
	}, {
		key: "year",
		callback: (ind) => {
			setTime((prev) => {
				const prevState = prev;

				prevState.day.available = FormatDate.allDaysInMonth(
					time.year.available[ind],
					prevState.month.selected,
				).filter(Check.isStrictNumber);
				prevState.year.selected = ind;

				return { ...prevState };
			});
		},
	}]);

	useEffect(() => {
		const keys = Object.keys(time);
		const isEmpty = keys.some((key) => time[key].selected === null);

		if (isEmpty) {
			return;
		}

		onChange(new Date(...keys.map((key) => (time[key].format
			? time[key].available[time[key].selected]
			: time[key].selected))));
	}, [time]);

	return (
		<div
			id={id}
			className={style.birthSelector}
		>
			{selects.current.map(({
				key,
				callback,
			}) => (
				<Select
					key={key}
					id={style[key]}
					className={`${className}`}
					placeholder={t(key)}
					defaultValue={time[key].available[time[key].selected]}
					values={time[key].available}
					onChange={callback}
				/>
			))}
		</div>
	);
}

BirthSelctor.defaultProps = {
	date: null,
};

BirthSelctor.propTypes = {
	id: types.string.isRequired,
	className: types.string.isRequired,
	onChange: types.func.isRequired,
	date: types.instanceOf(Object),
};

export default BirthSelctor;