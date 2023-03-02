import { useEffect, useState } from "react";
import types from "prop-types";

import Checkbox from "@/components/UI/Form/Checkbox/Checkbox.jsx";

import style from "./CheckboxList.module.css";

function CheckboxList({ className, values, onChange }) {
	const [checkedOptions, setOption] = useState([]);

	function onCheck(option, isChecked) {
		setOption((prev) => {
			let array = prev;

			if (isChecked) {
				array = [...prev, option];
			} else {
				array = prev.filter((_opt) => option !== _opt);
			}

			return [...array];
		}, []);
	}

	useEffect(() => {
		onChange(checkedOptions);
	}, [checkedOptions]);

	return (
		<div className={`${className} ${style.list}`}>
			{values.map((value) => (
				<Checkbox
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
};

CheckboxList.propTypes = {
	values: types.instanceOf(Array).isRequired,
	className: types.string,
	onChange: types.func.isRequired,
};

export default CheckboxList;
