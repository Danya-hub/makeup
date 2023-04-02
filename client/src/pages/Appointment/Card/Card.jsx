import { useTranslation } from "react-i18next";
import types from "prop-types";

import style from "./Card.module.css";

function Card({
	id,
	className,
	procedure,
	styleAttr,
	isExists,
	isSelected,
	onMouseDown,
	start,
	finish,
}) {
	const { t } = useTranslation();

	const backColor = isExists ? procedure.state.color : "lightGray";
	const border = isSelected ? "inset 0 0 0 2px rgb(var(--black))" : "";

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
				<span>
					{start}
					—
					{finish}
				</span>
				{/* <span>{procedure.fnClient}</span> */}
			</div>
			<span className="status">{t(procedure.type.state)}</span>
			<p className="procedureName">{procedure.type.name}</p>
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
	procedure: types.instanceOf(Object).isRequired,
	styleAttr: types.instanceOf(Object),
	isExists: types.bool,
	isSelected: types.bool,
	onMouseDown: types.func,
	start: types.string.isRequired,
	finish: types.string.isRequired,
};

export default Card;
