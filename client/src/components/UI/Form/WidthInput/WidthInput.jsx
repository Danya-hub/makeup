import types from "prop-types";

import LazyInput from "@/components/UI/Form/LazyInput/LazyInput.jsx";

WidthInput.propTypes = {
	value: types.func,
	styleAttr: types.object,
	onChange: types.func,
};

function WidthInput({ value, styleAttr, onChange, ...props }) {
	const widthInput = (value() || "").getWidthByChar();

	return (
		<LazyInput
			{...props}
			type="text"
			value={value}
			styleAttr={{
				...styleAttr,
				width: `${widthInput}px`,
			}}
			onChange={onChange}
		/>
	);
}

export { WidthInput as default };
