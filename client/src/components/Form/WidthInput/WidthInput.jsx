import { useMemo } from "react";
import types from "prop-types";

import getWidthByChar from "@/helpers/widthByChar.js";
import LazyInput from "@/components/Form/LazyInput/LazyInput.jsx";

WidthInput.propTypes = {
	value: types.oneOfType([types.func, types.string]),
	styleAttr: types.object,
	onChange: types.func,
};

function WidthInput({ value, styleAttr, onChange, ...props }) {
	const _value = useMemo(() => (typeof value === "function" ? value() : value), [value]);
	const widthInput = getWidthByChar(_value || "");

	return (
		<LazyInput
			{...props}
			type="text"
			value={() => _value}
			styleAttr={{
				...styleAttr,
				width: `${widthInput}px`,
			}}
			onChange={onChange}
		/>
	);
}

export { WidthInput as default };
