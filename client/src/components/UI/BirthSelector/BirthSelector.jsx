import { useState, useContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import types from "prop-types";

import Check from "@/helpers/check.js";

import FormatDate from "@/utils/formatDate.js";
import Select from "@/components/UI/Form/Select/Select.jsx";
import LangContext from "@/context/lang.js";

import style from "./BirthSelector.module.css";

function BirthSelctor({
	id,
	className,
	onChange,
}) {
	const { t } = useTranslation();
	const [{
		currentLang,
	}] = useContext(LangContext);

	const [openSelect, setOpenSelect] = useState({
		day: false,
		month: false,
		year: false,
	});
	const [date, setDate] = useState(new Date());

	const days = FormatDate.allDaysInMonth(date).filter(Check.isStrictNumber);
	const months = useRef(FormatDate.allMonthsInYear(currentLang));
	const years = useRef(FormatDate.allYears(date, 100).reverse());

	function handleChangeYear(ind) {
		setDate((prev) => {
			prev.setFullYear(years.current[ind]);

			return prev;
		});

		onChange(date);
	}

	function handleChangeMonth(ind) {
		setDate((prev) => {
			prev.setMonth(ind);

			return prev;
		});

		onChange(date);
	}

	function handleChangeDay(ind) {
		setDate((prev) => {
			prev.setDate(days[ind]);

			return prev;
		});

		onChange(date);
	}

	function handleSwitchSelect(value, key) {
		setOpenSelect((prev) => {
			const state = prev;

			state[key] = value;

			return {
				...state,
			};
		});
	}

	return (
		<div
			id={id}
			className={style.birthSelector}
		>
			<Select
				id={style.day}
				className={className}
				// ref={ref}
				defaultValue={t("day")}
				values={days}
				openState={[openSelect.day, (value) => handleSwitchSelect(value, "day")]}
				onChange={handleChangeDay}
			/>
			<Select
				id={style.month}
				className={className}
				// ref={ref}
				defaultValue={t("month")}
				values={months.current}
				openState={[openSelect.month, (value) => handleSwitchSelect(value, "month")]}
				onChange={handleChangeMonth}
			/>
			<Select
				id={style.year}
				className={className}
				// ref={ref}
				defaultValue={t("year")}
				values={years.current}
				openState={[openSelect.year, (value) => handleSwitchSelect(value, "year")]}
				onChange={handleChangeYear}
			/>
		</div>
	);
}

BirthSelctor.propTypes = {
	id: types.string.isRequired,
	className: types.string.isRequired,
	onChange: types.func.isRequired,
};

export default BirthSelctor;