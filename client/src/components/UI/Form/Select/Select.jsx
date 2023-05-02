/* eslint-disable react/prop-types */

import { useState, useEffect, memo } from "react";
import { useTranslation } from "react-i18next";
import types from "prop-types";

import ArrowSrc from "@/assets/image/arrow.svg";

import useOutsideEvent from "@/hooks/useOutsideEvent.js";

import style from "./Select.module.css";

function Select({
	id,
	className,
	values,
	onChange,
	defaultValue,
	placeholder,
	isAbsPos,
}) {
	const { t } = useTranslation();

	const EMPTY_VALUE_TEXT = `${t("select")}...`;

	const [isOpen, setOpenState] = useState(false);
	const [selectValue, setSelectValue] = useState(placeholder || EMPTY_VALUE_TEXT);

	function handleCloseSelect() {
		setOpenState(false);
	}

	const ref = useOutsideEvent(handleCloseSelect);

	useEffect(() => {
		setSelectValue(defaultValue == null ? placeholder : defaultValue);
	}, [defaultValue]);

	return (
		<div
			id={id}
			ref={ref}
			className={`${style.select} ${isOpen ? style.open : ""} ${isAbsPos ? style.absolute : ""} ${className}`}
		>
			<button
				type="button"
				onClick={() => setOpenState(!isOpen)}
				className={`${style.selectValue} ${placeholder && placeholder === selectValue ? style.placeholder : ""} button`}
			>
				<h3>{selectValue}</h3>
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
						className="button"
						onClick={() => {
							setSelectValue(values[i]);
							setOpenState(false);

							onChange(i, values[i], values);
						}}
						key={`${value}/option`}
					>
						{value}
					</button>
				))}
			</div>
		</div>
	);
}

Select.defaultProps = {
	id: "",
	className: "",
	isAbsPos: true,
	defaultValue: null,
	placeholder: null,
};

Select.propTypes = {
	id: types.string,
	className: types.string,
	values: types.instanceOf(Array).isRequired,
	onChange: types.func.isRequired,
	defaultValue: types.oneOfType([types.string, types.number]),
	placeholder: types.string,
	isAbsPos: types.bool,
};

export default memo(Select);
