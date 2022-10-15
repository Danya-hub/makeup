import { useSelector } from "react-redux";
import types from "prop-types";

import { default as LeftArrowSrc } from "@/assets/image/leftArrow.svg";
import { default as RightArrowSrc } from "@/assets/image/rightArrow.svg";

import style from "./Navigation.module.css";

Navigation.propTypes = {
	locale: types.object,
	month: types.array,
};

function Navigation({ locale, month }) {
	const [_month, setMonth] = month;
	const lng = useSelector((state) => state.langs.currLng);

	function setPrevMonth() {
		const prevMonth = _month - 1;
		setMonth(prevMonth);

		locale.setFullYear(locale.getFullYear() - (!(prevMonth % 12) ? 1 : 0));
		locale.setMonth((locale.getMonth() || 12) - 1);
	}

	function setNextMonth() {
		const nextMonth = _month + 1;
		setMonth(nextMonth);

		locale.setMonth(locale.getMonth() + 1);
	}

	return (
		<div className={style.topPanel}>
			<button
				type="button"
				className={style.switchMonth}
				id="prev"
				onClick={setPrevMonth}
			>
				<img
					className={style.arrow}
					src={LeftArrowSrc}
					alt="leftArrow"
				/>
			</button>
			<h2 className={style.nameMonth}>
				{locale.toLocaleString(lng, {
					month: "long",
				})}{" "}
				{locale.getFullYear()}
			</h2>
			<button
				type="button"
				className={style.switchMonth}
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

export { Navigation as default };
