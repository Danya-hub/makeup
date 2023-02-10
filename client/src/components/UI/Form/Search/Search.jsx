import { memo, useState, useEffect } from "react";
import types from "prop-types";

import CheckboxList from "@/components/UI/Form/CheckboxList/CheckboxList.jsx";

import style from "./Search.module.css";

Search.propTypes = {
	values: types.array,
	keys: types.array,
	placeholder: types.string,
	onSearch: types.func,
	onSelectOption: types.func,
	hasVisualOptions: types.bool,
	isOpen: types.bool,
	hasMultipleOption: types.bool,
};

const MAX_COLUMN = 5;

function Search({
	values,
	placeholder = "",
	onSearch,
	onSelectOption,
	hasVisualOptions = true,
	isOpen = false,
	hasMultipleOption = false,
}) {
	const [options, setOption] = useState([]);
	const [_isOpen, setBoolOpen] = useState(isOpen);

	function handleSwitch(state) {
		setBoolOpen(state);
	}

	function handleChange(e) {
		const query = e.target.value.toLowerCase();
		const res = values.filter((value) => value.toLowerCase().includes(query));

		setOption(res);
		onSearch(e.target.value);
	}

	function handleClick(_options) {
		onSelectOption(_options);
	}

	useEffect(() => {
		if (options.length) {
			return;
		}

		setOption(values);
	}, [values]);

	return (
		<div className={`${style.search} ${_isOpen ? style.open : ""}`}>
			<input
				className="border input"
				type="text"
				placeholder={placeholder}
				onChange={handleChange}
				onFocus={() => handleSwitch(true)}
			/>
			{hasVisualOptions && (
				hasMultipleOption ?
					<CheckboxList
						className={style.border}
						values={options}
						onChange={handleClick}
					></CheckboxList> : <ul className={`${style.options} ${style.border}`}>
						{options.map(
							(value, i) =>
								i < MAX_COLUMN && (
									<li key={value + "/" + i}>
										<span onClick={() => handleClick([options[i]])}>{value}</span>
									</li>
								)
						)}
					</ul>
			)}
		</div>
	);
}

export default memo(Search);
