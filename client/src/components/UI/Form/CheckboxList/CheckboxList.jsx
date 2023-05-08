import { useEffect, useState, memo } from "react";
import types from "prop-types";

import Checkbox from "@/components/UI/Form/Checkbox/Checkbox.jsx";

import style from "./CheckboxList.module.css";

function CheckboxList({ className, defaultOptions, values, onChange }) {
	const [checkedOptions, setOption] = useState(defaultOptions);

	function onCheck(option, isChecked) {
		setOption((prev) => {
			let object = prev;

			if (isChecked) {
				object = {
					...prev,
					[option]: option,
				};
			} else {
				delete object[option];
			}

			return {
				...object,
			};
		}, []);
	}

	useEffect(() => {
		onChange(checkedOptions);
	}, [checkedOptions]);

	return (
		<div className={`${className} ${style.list}`}>
			{values.map((value) => (
				<Checkbox
					checked={Boolean(checkedOptions[value])}
					key={value}
					text={value}
					onCheck={(isChecked) => onCheck(value, isChecked)}
				/>
			))}
		</div>
	);
}

CheckboxList.defaultProps = {
	className: "",
	defaultOptions: {},
};

CheckboxList.propTypes = {
	values: types.instanceOf(Array).isRequired,
	className: types.string,
	onChange: types.func.isRequired,
	defaultOptions: types.instanceOf(Object),
};

export default memo(CheckboxList);
