/* eslint-disable react/prop-types */

import { useState, useEffect, memo, forwardRef } from "react";
import { useTranslation } from "react-i18next";

import ArrowSrc from "@/assets/image/arrow.svg";

import style from "./Select.module.css";

function Select({
	id, openState, values, onChange, defaultValue, isAbsPos = true,
}, ref) {
	const { t } = useTranslation();

	const [selectValue, setSelectValue] = useState(null);

	const [isActive, setActive] = openState;
	const EMPTY_VALUE_TEXT = `${t("select")}...`;

	useEffect(() => {
		setSelectValue(defaultValue);
	}, [defaultValue]);

	return (
		<div
			id={id}
			ref={ref}
			className={`${style.select} ${isActive ? style.open : ""} ${isAbsPos ? style.absolute : ""}`}
		>
			<button
				type="button"
				onClick={() => setActive(!isActive)}
				className={style.selectValue}
			>
				<h3>{!selectValue ? EMPTY_VALUE_TEXT : selectValue}</h3>
				<img
					className={style.arrow}
					src={ArrowSrc}
					alt="arrow"
				/>
			</button>
			<div className="options">
				{values.map((value, i) => (
					<button
						type="button"
						onClick={() => {
							setSelectValue(values[i]);
							setActive(false);

							onChange(i, values[i], values);
						}}
						key={value}
					>
						{value}
					</button>
				))}
			</div>
		</div>
	);
}

export default memo(forwardRef(Select));
