import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import types from "prop-types";

import FormatDate from "@/utils/formatDate.js";

import style from "./Card.module.css";

Card.propTypes = {
	id: types.string,
	className: types.string,
	procedure: types.object,
	styleAttr: types.object,
	isAddedToList: types.bool,
	isSelected: types.bool,
};

function Card({
	id = "",
	className = "",
	procedure,
	styleAttr = {},
	isAddedToList = true,
	isSelected = false,
	...props
}) {
	const { currLng } = useSelector((state) => state.langs);
	const { t } = useTranslation();

	const stringStartTime = FormatDate.stringHourAndMin(procedure.startProcTime, currLng),
		stringFinishTime = FormatDate.stringHourAndMin(procedure.finishProcTime, currLng);
	const backColor = isAddedToList ? procedure.state.color : "lightGray",
		border = isSelected ? "inset 0 0 0 2px rgb(var(--black))" : "";

	return (
		<div
			{...props}
			id={id}
			className={`${style.card} ${className}`}
			style={{
				background: `rgb(var(--${backColor}))`,
				boxShadow: border,
				"--ind": isSelected ? 2 : 1,
				...styleAttr,
			}}
		>
			<div className="time">
				<span>
					{stringStartTime}—{stringFinishTime}
				</span>
				<span>{procedure.fnClient}</span>
			</div>
			<span className="status">{t(procedure.state.name)}</span>
			<p className="procedureName">{procedure.type.name}</p>
		</div>
	);
}

export { Card as default };
