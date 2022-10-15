import { useState, useEffect, memo } from "react";
import types from "prop-types";

import style from "./Select.module.css";
import { default as ArrowSrc } from "@/assets/image/arrow.svg";

Select.propTypes = {
	id: types.string,
	strictSwitch: types.array,
	values: types.arrayOf(types.string),
	onChange: types.func,
	defaultValue: types.string,
};

function Select({ id = "", strictSwitch, values, onChange, defaultValue }) {
	const [selectValue, setSelectValue] = useState(defaultValue || values[0]);
	const [isActive, setActive] = strictSwitch || useState(false);

	useEffect(() => {
		if (!defaultValue) {
			return;
		}

		setSelectValue(defaultValue);
	}, [defaultValue]);

	return (
		<div
			id={id}
			className={`${style.select} ${isActive ? style.open : ""}`}
		>
			<div
				className={style.activeEl}
				onClick={() => setActive(!isActive)}
			>
				<span>{selectValue}</span>
				<img
					className={style.arrow}
					src={ArrowSrc}
					alt="arrow"
				/>
			</div>
			<div className={style.options}>
				{values.map((value, i) => (
					<span
						onClick={() => {
							setSelectValue(values[i]);
							setActive(false);

							onChange(i);
						}}
						key={value + "/" + i}
					>
						{value}
					</span>
				))}
			</div>
		</div>
	);
}

export default memo(Select);
