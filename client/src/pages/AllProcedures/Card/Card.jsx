import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import types from "prop-types";

import FormatDate from "@/utils/formatDate.js";

import style from "./Card.module.css";

function Card({
	key,
	id,
	className,
	procedure,
	styleAttr,
	isAddedToList,
	isSelected,
	onMouseDown,
}) {
	const { currLng } = useSelector((state) => state.langs);
	const { t } = useTranslation();

	const stringStartTime = FormatDate.stringHourAndMin(procedure.startProcTime, currLng);
	const stringFinishTime = FormatDate.stringHourAndMin(procedure.finishProcTime, currLng);
	const backColor = isAddedToList ? procedure.state.color : "lightGray";
	const border = isSelected ? "inset 0 0 0 2px rgb(var(--black))" : "";

	return (
		// event for card
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<div
			key={key}
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
				<span>
					{stringStartTime}
					—
					{stringFinishTime}
				</span>
				{/* <span>{procedure.fnClient}</span> */}
			</div>
			<span className="status">{t(procedure.state.name)}</span>
			<p className="procedureName">{procedure.type.name}</p>
		</div>
	);
}

Card.defaultProps = {
	key: "",
	id: "",
	className: "",
	styleAttr: {},
	isAddedToList: true,
	isSelected: false,
	onMouseDown: null,
};

Card.propTypes = {
	key: types.string,
	id: types.string,
	className: types.string,
	procedure: types.instanceOf(Object).isRequired,
	styleAttr: types.instanceOf(Object),
	isAddedToList: types.bool,
	isSelected: types.bool,
	onMouseDown: types.func,
};

export default Card;
