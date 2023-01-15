import { memo, useState } from "react";
import types from "prop-types";

import changePropertyValue from "@/helpers/changePropertyValue.js";
import Check from "@/helpers/check.js";
import WidthInput from "@/components/UI/Form/WidthInput/WidthInput.jsx";

import style from "./Range.module.css";

Range.propTypes = {
	id: types.string,
	min: types.number,
	max: types.number,
	onChange: types.func,
};

const INPUT_MIN_VALUE = 0;
const INPUT_MAX_VALUE = 100;

function Range({ id, min = INPUT_MIN_VALUE, max = INPUT_MIN_VALUE, onChange }) {
	const [options, setOption] = useState({
		min: INPUT_MIN_VALUE,
		max: INPUT_MAX_VALUE,
	});

	const minInputValue = parseInt((options.min / INPUT_MAX_VALUE) * (max - min)) + min,
		maxInputValue = parseInt((options.max / INPUT_MAX_VALUE) * (max - min)) + min;

	const background = `linear-gradient(
							to right,
							rgb(var(--gray)) ${options.min}%,
							rgb(var(--black)) ${options.min}%,
							rgb(var(--black)) ${options.max}%,
							rgb(var(--gray)) ${options.max}%
						)`;

	function handleClick() {
		onChange({
			...options,
			minValue: minInputValue,
			maxValue: maxInputValue,
		});
	}

	function handleGrab(e) {
		const x = Number(e.currentTarget.value);

		const startRange = Math.abs(x - options.min),
			finishRange = Math.abs(x - options.max);

		setPosition(startRange < finishRange ? "min" : "max", x);
	}

	function handleChange(e) {
		const eventKey = e.currentTarget.name;
		const eventValue = Number(e.currentTarget.value);

		const percent = ((eventValue - min) * INPUT_MAX_VALUE) / (max - min);
		const isBNumber = Check.isFloat(eventValue),
			isBFinite = isFinite(percent);

		const rez =
			(!isBNumber || percent < INPUT_MIN_VALUE) && eventKey === "min"
				? INPUT_MIN_VALUE
				: (!isBNumber || percent > INPUT_MAX_VALUE) && eventKey === "max"
				? INPUT_MAX_VALUE
				: eventKey === "min" && (options.max / INPUT_MAX_VALUE) * eventValue > options.max
				? options.max
				: eventKey === "max" && (options.min / INPUT_MAX_VALUE) * eventValue < options.min
				? options.min
				: INPUT_MIN_VALUE > eventValue
				? INPUT_MIN_VALUE
				: INPUT_MAX_VALUE < eventValue
				? INPUT_MAX_VALUE
				: (isBFinite ? percent : 0) || (eventKey === "min" ? INPUT_MIN_VALUE : INPUT_MAX_VALUE);

		setPosition(eventKey, rez);
	}

	function setPosition(name, x) {
		changePropertyValue(
			{
				[name]: x,
			},
			setOption
		);
	}

	return (
		<div
			className={style.range}
			id={id}
		>
			<div className={style.inputs}>
				<div>
					<WidthInput
						isFitContent={false}
						className="border"
						type="text"
						name="min"
						placeholder={minInputValue}
						value={minInputValue}
						onChange={handleChange}
					/>
					<span>—</span>
					<WidthInput
						isFitContent={false}
						className="border"
						type="text"
						name="max"
						placeholder={minInputValue}
						value={maxInputValue}
						onChange={handleChange}
					/>
				</div>
				<button
					className="button border"
					onClick={handleClick}
				>
					ок
				</button>
			</div>
			<div className={style.rangeWrapper}>
				<input
					style={{
						background,
					}}
					type="range"
					id="range"
					min={INPUT_MIN_VALUE}
					max={INPUT_MAX_VALUE}
					defaultValue={0}
					onChange={handleGrab}
				></input>
				<div className={style.track}>
					<span
						style={{
							left: `${options.min}%`,
						}}
						id="min"
						className={style.thumb}
					></span>
					<span
						style={{
							left: `${options.max}%`,
						}}
						id="max"
						className={style.thumb}
					></span>
				</div>
			</div>
		</div>
	);
}

export default memo(Range);
