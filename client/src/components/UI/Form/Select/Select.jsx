/* eslint-disable react/prop-types */

import { useState, useEffect, memo, forwardRef } from "react";
import { useTranslation } from "react-i18next";

import style from "./Select.module.css";
import { default as ArrowSrc } from "@/assets/image/arrow.svg";

function Select({ id, strictSwitch, values, onChange, defaultValue, isAbsPos = true }, ref) {
	const { t } = useTranslation();

	const [selectValue, setSelectValue] = useState(null);

	const [isActive, setActive] = strictSwitch || useState(false);
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
			<div
				className={style.selectValue}
				onClick={() => setActive(!isActive)}
			>
				<h3>{!selectValue ? EMPTY_VALUE_TEXT : selectValue}</h3>
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

							onChange(i, values[i], values);
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
