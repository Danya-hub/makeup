import { memo, useState, useEffect } from "react";
import types from "prop-types";

import CheckboxList from "@/components/UI/Form/CheckboxList/CheckboxList.jsx";

import style from "./Search.module.css";

import strictOptions from "./constants/options.js";

function Search({
	values,
	placeholder,
	onSearch,
	onSelectOption,
	hasVisualOptions,
	isOpen,
	hasMultipleOption,
}) {
	const [options, setOption] = useState(values);
	const [_isOpen, setBoolOpen] = useState(isOpen);

	function handleSwitch(state) {
		setBoolOpen(state);
	}

	function handleClick(selectedOptions) {
		onSelectOption(selectedOptions);
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
				onChange={(e) => onSearch(e.target.value, setOption)}
				onFocus={() => handleSwitch(true)}
				autoComplete="off"
			/>
			{hasVisualOptions
				&& (hasMultipleOption ? (
					<CheckboxList
						className={style.checkboxList}
						values={options}
						onChange={handleClick}
					/>
				) : (
					<ul className={`${style.options} ${style.border}`}>
						{options.map(
							(value, i) => i < strictOptions.MAX_COLUMN && (
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
