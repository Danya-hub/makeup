import types from "prop-types";

import style from "./Prompt.module.css";

function Prompt({ id, iconName, children, text, direction }) {
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
				{children}
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
	children: types.oneOfType([
		types.array,
		types.object,
	]).isRequired,
	text: types.string.isRequired,
	direction: types.string,
};

export default Prompt;
