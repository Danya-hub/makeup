import { memo, useState } from "react";
import types from "prop-types";

import Recursive from "@/helpers/recursive.js";

import style from "./Search.module.css";

Search.propTypes = {
	values: types.array,
	keys: types.array,
	placeholder: types.string,
	onChange: types.func,
};

const MAX_COLUMN = 5;

function Search({ values, placeholder = "", keys, onChange }) {
	const [options, setOption] = useState([]);
	const [visualTexts, setTextOption] = useState([]);
	const [isOpen, setBoolOpen] = useState(false);

	function handleSwitch(_isOpen) {
		setBoolOpen(_isOpen);
	}

	function handleChange(e) {
		const query = e.target.value.toLowerCase();
		const _textOptions = [];

		const rez = values.filter((obj) => {
			const value = Recursive.getPropValue(keys)(obj);
			const isFinded = value.toLowerCase().includes(query);

			if (isFinded) {
				_textOptions.push(value);
			}

			return isFinded;
		});

		setTextOption(_textOptions);
		setOption(rez);

		onChange(rez);
	}

	function handleClick(i) {
		onChange([options[i]]);
	}

	return (
		<div className={`${style.search} ${isOpen ? style.open : ""}`}>
			<input
				className="border"
				type="text"
				placeholder={placeholder}
				onChange={handleChange}
				onFocus={() => handleSwitch(true)}
				onBlur={() => handleSwitch(false)}
			/>
			<ul className={style.options}>
				{visualTexts.map(
					(value, i) =>
						i < MAX_COLUMN && (
							<li key={value + "/" + i}>
								<span onClick={() => handleClick(i)}>{value}</span>
							</li>
						)
				)}
			</ul>
		</div>
	);
}

export default memo(Search);
