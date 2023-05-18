import types from "prop-types";

import GlobalHelper from "@/utils/global.js";

import LazyInput from "@/components/UI/Form/LazyInput/LazyInput.jsx";

function WidthInput({
	value,
	styleAttr,
	onChange,
	isFitContent,
	title,
	placeholder,
	onBlur,
	className,
}) {
	const widthInput = GlobalHelper.getWidthByChar(value.toString() || "");

	return (
		<LazyInput
			className={className}
			type="text"
			title={title}
			placeholder={placeholder}
			onBlur={onBlur}
			style={{
				...styleAttr,
				[isFitContent ? "width" : "minWidth"]: `${widthInput}px`,
			}}
			onChange={onChange}
			value={() => value}
		/>
	);
}

WidthInput.defaultProps = {
	className: "",
	isFitContent: true,
	title: "",
	value: "",
	onBlur: null,
	placeholder: "",
	styleAttr: {},
};

WidthInput.propTypes = {
	className: types.string,
	value: types.oneOfType([
		types.string,
		types.number,
	]),
	styleAttr: types.instanceOf(Object),
	onChange: types.func.isRequired,
	isFitContent: types.bool,
	title: types.string,
	placeholder: types.oneOfType([
		types.string,
		types.number,
	]),
	onBlur: types.func,
};

export default WidthInput;
