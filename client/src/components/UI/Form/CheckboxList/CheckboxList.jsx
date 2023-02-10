import { useEffect, useState } from "react";
import types from "prop-types";

import Checkbox from "@/components/UI/Form/Checkbox/Checkbox.jsx";

import style from "./CheckboxList.module.css";

CheckboxList.propTypes = {
	values: types.array,
	className: types.string,
	onChange: types.func,
};

function CheckboxList({ className, values, onChange }) {
	const [checkedOptions, setOption] = useState([]);

	function onCheck(option, isChecked) {
		setOption((prev) => {
			if (isChecked) {
				prev = [...prev, option];
			} else {
				prev = prev.filter((_opt) => option !== _opt);
			}

			return [...prev];
		}, []);
	}

	useEffect(() => {
		onChange(checkedOptions);
	}, [checkedOptions]);

	return (
		<div className={`${className} ${style.list}`}>
			{values.map((value, i) => (
				<Checkbox
					key={`${value}/${i}`}
					text={value}
					onCheck={onCheck.bind(null, value)}
				></Checkbox>
			))}
		</div>
	);
}

export { CheckboxList as default };
