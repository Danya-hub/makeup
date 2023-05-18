import { memo } from "react";
import types from "prop-types";

import style from "./Prompt.module.css";

function Prompt({
	id,
	iconName,
	text,
	direction,
	render,
}) {
	return (
		<div
			id={id}
			className={style.prompt}
		>
			<div className="title">
				<i
					className={`fa fa-${iconName}`}
					aria-hidden="true"
				/>
				{text && <span>{text}</span>}
			</div>
			<div
				className={style.wrapper}
				style={{
					[direction]: 0,
				}}
			>
				{render()}
			</div>
		</div>
	);
}

Prompt.defaultProps = {
	id: "",
	direction: "left",
};

Prompt.propTypes = {
	id: types.string,
	iconName: types.string.isRequired,
	render: types.func.isRequired,
	text: types.string.isRequired,
	direction: types.string,
};

export default memo(Prompt);
