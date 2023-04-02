import { useContext } from "react";
import types from "prop-types";

import LangContext from "@/context/lang.js";

import LeftArrowSrc from "@/assets/image/leftArrow.svg";
import RightArrowSrc from "@/assets/image/rightArrow.svg";

import style from "./Navigation.module.css";

function Navigation({ options }) {
	const [{ currentLang }] = useContext(LangContext);

	const {
		month: [month, setMonth],
		year,
		locale,
	} = options;

	const monthName = locale.toLocaleString(currentLang, {
		month: "long",
	});

	function setPrevMonth() {
		setMonth(month - 1);
	}

	function setNextMonth() {
		setMonth(month + 1);
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
};

export default Navigation;
