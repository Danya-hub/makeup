import { useState } from "react";
import types from "prop-types";

LazyInput.propTypes = {
	className: types.string,
	value: types.func,
	style: types.object,
	onChange: types.func,
};

function LazyInput({ className = "", value = "", style = {}, onChange, ...props }) {
	const [isTyping, setTyping] = useState(false);
	const [_value, setValue] = useState(value);

	return (
		<input
			{...props}
			className={`${className} input`}
			value={isTyping ? _value : value()}
			onBlur={(e) => {
				setTyping(false);

				if (onChange) {
					onChange(e, _value);
				}
			}}
			onChange={(e) => {
				setValue(e.target.value);
				setTyping(true);
			}}
			style={style}
		/>
	);
}

export { LazyInput as default };
