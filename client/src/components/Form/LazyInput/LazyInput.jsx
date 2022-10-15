import { useState } from "react";
import types from "prop-types";

LazyInput.propTypes = {
	value: types.oneOfType([types.string, types.func]),
	styleAttr: types.object,
	onChange: types.func,
};

function LazyInput({ value, styleAttr = {}, onChange, ...props }) {
	const [isTyping, setTyping] = useState(false);
	const [_value, setValue] = useState(typeof value === "function" ? value() : value);
	const [finalValue, setFinalValue] = useState("");

	return (
		<input
			{...props}
			value={isTyping ? _value : typeof value === "function" ? value() : finalValue}
			onBlur={() => {
				setTyping(false);
				setFinalValue(_value);

				if (onChange) {
					onChange(_value);
				}
			}}
			onChange={(e) => {
				setValue(e.target.value);
				setTyping(true);
			}}
			style={styleAttr}
		/>
	);
}

export { LazyInput as default };
