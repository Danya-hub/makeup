import { useContext } from "react";
import types from "prop-types";

import GlobalContext from "@/context/global.js";

import LeftArrowSrc from "@/assets/image/leftArrow.svg";
import RightArrowSrc from "@/assets/image/rightArrow.svg";

import style from "./Navigation.module.css";

function Navigation({
	options,
	onChange,
}) {
	const {
		currentLang,
	} = useContext(GlobalContext);

	const {
		day,
		month,
		setMonth,
		year,
		locale,
	} = options;
	const monthName = Intl.DateTimeFormat(currentLang, {
		month: "long",
	}).format(locale);

	function setPrevMonth() {
		const m = month - 1;

		onChange(
			new Date(year, m, day),
			() => setMonth(m),
		);
	}

	function setNextMonth() {
		const m = month + 1;

		onChange(
			new Date(year, m, day),
			() => setMonth(m),
		);
	}

	return (
		<div className={style.topPanel}>
			<button
				type="button"
				id="prev"
				className={`button ${style.switchMonth}`}
				onClick={setPrevMonth}
			>
				<img
					className={style.arrow}
					src={LeftArrowSrc}
					alt="leftArrow"
				/>
			</button>
			<h2 className={style.nameMonth}>{`${monthName} ${year}`}</h2>
			<button
				type="button"
				className={`button ${style.switchMonth}`}
				id="next"
				onClick={setNextMonth}
			>
				<img
					className={style.arrow}
					src={RightArrowSrc}
					alt="rightArrow"
				/>
			</button>
		</div>
	);
}

Navigation.propTypes = {
	options: types.instanceOf(Object).isRequired,
	onChange: types.func.isRequired,
};

export default Navigation;
