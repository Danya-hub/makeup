import { useState } from "react";
import types from "prop-types";

function LazyInput({ className, value, style, onChange, title, placeholder, onBlur }) {
	const [isTyping, setTyping] = useState(false);
	const [inputValue, setValue] = useState(value);

	return (
		<input
			type="text"
			title={title}
			placeholder={placeholder}
			className={`${className} input`}
			value={isTyping ? inputValue : value()}
			onBlur={(e) => {
				setTyping(false);

				if (onChange) {
					onChange(e, inputValue);
				}

				onBlur();
			}}
			onChange={(e) => {
				setValue(e.target.value);
				setTyping(true);
			}}
			style={style}
		/>
	);
}

LazyInput.defaultProps = {
	className: "",
	value: "",
	style: {},
	title: "",
	placeholder: "",
	onBlur: null,
};

LazyInput.propTypes = {
	className: types.string,
	value: types.func,
	style: types.instanceOf(Object),
	onChange: types.func.isRequired,
	title: types.string,
	placeholder: types.oneOfType([
		types.string,
		types.number,
	]),
	onBlur: types.func,
};

export default LazyInput;
