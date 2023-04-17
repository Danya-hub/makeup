import { useContext } from "react";
import { useTranslation } from "react-i18next";
import types from "prop-types";

import FormatDate from "@/utils/formatDate.js";
import LangContext from "@/context/lang.js";

import style from "./Card.module.css";

function Card({
	id,
	date,
	className,
	procedure,
	styleAttr,
	isExists,
	isSelected,
	onMouseDown,
}) {
	const { t } = useTranslation();
	const [{
		currentLang,
	}] = useContext(LangContext);

	const backColor = isExists ? procedure.state.color : "lightGray";
	const border = isSelected ? "inset 0 0 0 2px rgb(var(--black))" : "";
	const formatedTimeCurrProc = FormatDate.stringHourAndMinWithRange(
		date,
		procedure.type.duration,
		currentLang,
	);

	return (
		// event for card
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<div
			id={id}
			className={`${style.card} ${className}`}
			style={{
				background: `rgb(var(--${backColor}))`,
				boxShadow: border,
				"--ind": isSelected ? 2 : 1,
				...styleAttr,
			}}
			onMouseDown={onMouseDown}
		>
			<div className="time">
				<span>{formatedTimeCurrProc}</span>
				{/* <span>{procedure.fnClient}</span> */}
			</div>
			<span className="status">{t(procedure.type.state)}</span>
			<p className="procedureName">{t(procedure.type.name)}</p>
		</div>
	);
}

Card.defaultProps = {
	id: "",
	className: "",
	styleAttr: {},
	isExists: true,
	isSelected: false,
	onMouseDown: null,
};

Card.propTypes = {
	id: types.string,
	className: types.string,
	date: types.instanceOf(Object).isRequired,
	procedure: types.instanceOf(Object).isRequired,
	styleAttr: types.instanceOf(Object),
	isExists: types.bool,
	isSelected: types.bool,
	onMouseDown: types.func,
};

export default Card;
