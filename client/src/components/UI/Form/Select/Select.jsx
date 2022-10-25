/* eslint-disable react/prop-types */

import { useState, useEffect, memo, forwardRef } from "react";

import style from "./Select.module.css";
import { default as ArrowSrc } from "@/assets/image/arrow.svg";

function Select({ id, strictSwitch, values, onChange, defaultValue }, ref) {
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
			ref={ref}
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

export default memo(forwardRef(Select));
