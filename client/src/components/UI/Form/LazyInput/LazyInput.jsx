import { useState } from "react";
import types from "prop-types";

function LazyInput({
	className,
	value,
	style,
	onChange,
	title,
	placeholder,
	onBlur,
	name,
}) {
	const [isTyping, setTyping] = useState(false);
	const [inputValue, setValue] = useState(value);

	return (
		<input
			type="text"
			title={title}
			name={name}
			placeholder={placeholder}
			className={`${className} input`}
			value={isTyping ? inputValue : value()}
			autoComplete="off"
			onBlur={(e) => {
				setTyping(false);

				if (onChange) {
					onChange(e, inputValue);
				}

				if (onBlur) {
					onBlur();
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
	name: types.string.isRequired,
};

export default LazyInput;
