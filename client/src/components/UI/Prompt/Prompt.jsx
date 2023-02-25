import types from "prop-types";

import style from "./Prompt.module.css";

Prompt.propTypes = {
	iconName: types.string,
	children: types.oneOfType([types.array, types.object]),
	text: types.string,
	direction: types.string,
};

function Prompt({ iconName, children, text, direction = "left", ...props }) {
	return (
		<div
			{...props}
			className={style.prompt}
		>
			<div className={style.icon}>
				<i
					className={`fa fa-${iconName}`}
					aria-hidden="true"
				></i>
				{text && <span>{text}</span>}
			</div>
			<div
				className={style.wrapper}
				style={{
					[direction]: 0,
				}}
			>
				{children}
			</div>
		</div>
	);
}

export { Prompt as default };
