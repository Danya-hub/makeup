import { useSelector } from "react-redux";
import types from "prop-types";

import LeftArrowSrc from "@/assets/image/leftArrow.svg";
import RightArrowSrc from "@/assets/image/rightArrow.svg";

import style from "./Navigation.module.css";

Navigation.propTypes = {
	locale: types.object,
	monthState: types.array,
	onChange: types.func,
};

function Navigation({ locale, monthState, onChange }) {
	const lng = useSelector((state) => state.langs.currLng);

	const [month, setMonth] = monthState;
	const monthName = locale.toLocaleString(lng, {
		month: "long",
	});
	const year = locale.getFullYear();

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

export { Navigation as default };
