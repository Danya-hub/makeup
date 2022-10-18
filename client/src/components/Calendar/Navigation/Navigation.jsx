import { useSelector } from "react-redux";
import types from "prop-types";

import { default as LeftArrowSrc } from "@/assets/image/leftArrow.svg";
import { default as RightArrowSrc } from "@/assets/image/rightArrow.svg";

import style from "./Navigation.module.css";

Navigation.propTypes = {
	locale: types.object,
};

function Navigation({ locale }) {
	const { propDate, monthState, onChange } = locale;
	const [month, setMonth] = monthState;
	const lng = useSelector((state) => state.langs.currLng);

	function setPrevMonth() {
		setMonth(month - 1);

		onChange(propDate);
	}

	function setNextMonth() {
		setMonth(month + 1);

		onChange(propDate);
	}

	return (
		<div className={style.topPanel}>
			<button
				type="button"
				className={`button ${style.switchMonth}`}
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
				{propDate.toLocaleString(lng, {
					month: "long",
				})}{" "}
				{propDate.getFullYear()}
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
