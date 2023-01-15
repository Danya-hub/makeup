import { useSelector } from "react-redux";
import types from "prop-types";

import { default as LeftArrowSrc } from "@/assets/image/leftArrow.svg";
import { default as RightArrowSrc } from "@/assets/image/rightArrow.svg";

import style from "./Navigation.module.css";

Navigation.propTypes = {
	locale: types.object,
	monthState: types.array,
	onChange: types.func,
};

function Navigation({ locale, monthState, onChange }) {
	const [month, setMonth] = monthState;
	const lng = useSelector((state) => state.langs.currLng);

	function setPrevMonth() {
		setMonth(month - 1);

		onChange(locale);
	}

	function setNextMonth() {
		setMonth(month + 1);

		onChange(locale);
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
			<h2 className={style.nameMonth}>
				{locale.toLocaleString(lng, {
					month: "long",
				})}{" "}
				{locale.getFullYear()}
			</h2>
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

export { Navigation as default };
