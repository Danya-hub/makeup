/* eslint-disable react/jsx-props-no-spreading */
import { memo } from "react";
import types from "prop-types";

import icons from "./contsants/icons.js";

import style from "./StateInput.module.css";

function StateInput({
	id,
	onChange,
	state,
	className,
	...props
}) {
	const currState = state.find(([key, bln]) => bln && key);

	return (
		<div
			className={`${style.stateInput} field ${currState ? currState[0] : ""} ${className}`}
		>
			<input
				id={id}
				type="text"
				autoComplete="off"
				onChange={onChange}
				{...props}
			/>
			{currState && (
				<i
					className={`fa fa-${icons[currState[0]]}`}
					aria-hidden="true"
				/>
			)}
		</div>
	);
}

StateInput.defaultProps = {
	className: "",
};

StateInput.propTypes = {
	id: types.string.isRequired,
	className: types.string,
	onChange: types.func.isRequired,
	state: types.instanceOf(Object).isRequired,
};

export default memo(StateInput);