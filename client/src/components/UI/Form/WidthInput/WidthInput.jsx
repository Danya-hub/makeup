import types from "prop-types";

import LazyInput from "@/components/UI/Form/LazyInput/LazyInput.jsx";

WidthInput.propTypes = {
	value: types.oneOfType([types.string, types.number]),
	styleAttr: types.object,
	onChange: types.func,
	isFitContent: types.bool,
};

function WidthInput({ value, styleAttr, onChange, isFitContent = true, ...props }) {
	const widthInput = (value.toString() || "").getWidthByChar();

	return (
		<LazyInput
			{...props}
			type="text"
			style={{
				...styleAttr,
				[isFitContent ? "width" : "minWidth"]: `${widthInput}px`,
			}}
			onChange={onChange}
			value={() => value}
		/>
	);
}

export { WidthInput as default };
