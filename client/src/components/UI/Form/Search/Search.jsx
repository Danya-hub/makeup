import { memo, useState, useEffect } from "react";
import types from "prop-types";

import CheckboxList from "@/components/UI/Form/CheckboxList/CheckboxList.jsx";

import style from "./Search.module.css";

import constants from "./constants.js";

function Search({
	values,
	placeholder,
	onSearch,
	onSelectOption,
	hasVisualOptions,
	isOpen,
	hasMultipleOption,
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
			{hasVisualOptions
				&& (hasMultipleOption ? (
					<CheckboxList
						className={style.border}
						values={options}
						onChange={handleClick}
					/>
				) : (
					<ul className={`${style.options} ${style.border}`}>
						{options.map(
							(value, i) => i < constants.MAX_COLUMN && (
								<li key={value}>
									<button
										type="button"
										onClick={() => handleClick([options[i]])}
									>
										{value}
									</button>
								</li>
							),
						)}
					</ul>
				))}
		</div>
	);
}

Search.defaultProps = {
	placeholder: "",
	hasVisualOptions: true,
	isOpen: false,
	hasMultipleOption: false,
};

Search.propTypes = {
	values: types.instanceOf(Array).isRequired,
	placeholder: types.string,
	onSearch: types.func.isRequired,
	onSelectOption: types.func.isRequired,
	hasVisualOptions: types.bool,
	isOpen: types.bool,
	hasMultipleOption: types.bool,
};

export default memo(Search);
