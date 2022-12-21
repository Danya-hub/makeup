import { memo, useState, useEffect } from "react";
import types from "prop-types";

import changePropertyValue from "@/helpers/changePropertyValue.js";
import Type from "@/helpers/checkType.js";
import LazyInput from "@/components/UI/Form/LazyInput/LazyInput.jsx";

import style from "./Range.module.css";

Range.propTypes = {
	id: types.string,
	min: types.number,
	max: types.number,
	onChange: types.func
};

const INPUT_MIN_VALUE = 0;
const INPUT_MAX_VALUE = 100;

function Range({ id, min = 0, max = 0, onChange }) {
	const [options, setOption] = useState({
		min: INPUT_MIN_VALUE,
		max: INPUT_MAX_VALUE
	});

	const minInputValue = parseInt(options.min / INPUT_MAX_VALUE * (max - min)) + min,
		maxInputValue = parseInt(options.max / INPUT_MAX_VALUE * (max - min)) + min;

	useEffect(() => {
		return () => onChange({
			...options,
			minValue: minInputValue,
			maxValue: maxInputValue,
		});
	}, [options]);

	function handleGrab(e) {
		const x = Number(e.currentTarget.value);

		const startRange = Math.abs(x - options.min),
			finishRange = Math.abs(x - options.max);

		setPositionForThumb(
			startRange < finishRange ? "min" : "max",
			x,
		);
	}

	function handleChange(e) {
		const key = e.currentTarget.name;
		const value = e.currentTarget.value;

		const isNumber = Type.isNumber(value);

		const rez =
			(!isNumber && key == "min") ? INPUT_MIN_VALUE :
				(!isNumber && key == "max") ? INPUT_MAX_VALUE :
					key == "min" && (options.max / INPUT_MAX_VALUE * value > options.max) ? options.max :
						key == "max" && (options.min / INPUT_MAX_VALUE * value < options.min) ? options.min :
							(INPUT_MIN_VALUE > value) ? INPUT_MIN_VALUE :
								(INPUT_MAX_VALUE < value) ? INPUT_MAX_VALUE :
									((Number(value) - min) * INPUT_MAX_VALUE) / (max - min);

		changePropertyValue({
			[key]: rez,
		}, setOption);
	}

	function setPositionForThumb(name, x) {
		changePropertyValue({
			[name]: x,
		}, setOption);
	}

	return (
		<div
			className={style.range}
			id={id}
		>
			<div className={style.inputs}>
				<LazyInput
					type="text"
					name="min"
					value={() => minInputValue}
					onChange={handleChange}
				/>
				<span>—</span>
				<LazyInput
					type="text"
					name="max"
					value={() => maxInputValue}
					onChange={handleChange}
				/>
			</div>
			<div className={style.rangeWrapper}>
				<input
					style={{
						background: `linear-gradient(
							to right,
							rgb(183, 183, 183) ${options.min}%,
							rgb(0, 204, 0) ${options.min}%,
							rgb(0, 204, 0) ${options.max}%,
							rgb(183, 183, 183) ${options.max}%
						)`
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
