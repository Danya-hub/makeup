import { memo, useEffect, useState } from "react";
import types from "prop-types";

import Check from "@/utils/check.js";
import WidthInput from "@/components/UI/Form/WidthInput/WidthInput.jsx";

import style from "./Range.module.css";

import { INPUT_MAX_VALUE, INPUT_MIN_VALUE } from "./constants.js";

function Range({ id, min, max, onChange }) {
	const defaultOptions = () => ({
		min: {
			percent: INPUT_MIN_VALUE,
			number: min,
		},
		max: {
			percent: INPUT_MAX_VALUE,
			number: max,
		},
	});

	const [options, setOption] = useState(defaultOptions());

	const background = `linear-gradient(
		to right,
		rgb(var(--gray)) ${options.min.percent}%,
		rgb(var(--black)) ${options.min.percent}%,
		rgb(var(--black)) ${options.max.percent}%,
		rgb(var(--gray)) ${options.max.percent}%
	)`;

	function setRangeOptions(name, percent) {
		setOption((prev) => {
			const object = { ...prev };

			object[name].percent = percent;
			object[name].number = parseInt((percent / INPUT_MAX_VALUE) * (max - min), 10) + min;

			return object;
		});
	}

	function handleGrab(e) {
		const x = Number(e.currentTarget.value);

		const startRange = Math.abs(x - options.min.percent);
		const finishRange = Math.abs(x - options.max.percent);

		const name = startRange < finishRange ? "min" : "max";

		setRangeOptions(name, x);
	}

	function handleChange(e) {
		const inputName = e.currentTarget.name;
		const inputValue = Number(e.currentTarget.value);

		const isBNumber = Check.isFloat(inputValue);

		if (!isBNumber) {
			return;
		}

		const percent = ((inputValue - min) * INPUT_MAX_VALUE) / (max - min);
		const isBFinite = Number.isFinite(percent);

		if (!isBFinite) {
			return;
		}

		let rez = null;

		switch (inputName) {
			case "min":
				if (percent < INPUT_MIN_VALUE) {
					rez = INPUT_MIN_VALUE;
				} else if ((percent / INPUT_MAX_VALUE) * inputValue > options.max.percent) {
					rez = options.max.percent;
				} else {
					rez = percent;
				}
				break;

			case "max":
				if (percent > INPUT_MAX_VALUE) {
					rez = INPUT_MAX_VALUE;
				} else if ((percent / INPUT_MAX_VALUE) * inputValue < options.min.percent) {
					rez = options.min.percent;
				} else {
					rez = percent;
				}

				break;

			default:
				break;
		}

		setRangeOptions(inputName, rez);
	}

	useEffect(() => {
		onChange(options);
	}, [options.min.number, options.max.number]);

	useEffect(() => {
		setOption(defaultOptions());
	}, [min, max]);

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
						placeholder={options.min.number}
						value={options.min.number}
						onChange={handleChange}
					/>
					<span>—</span>
					<WidthInput
						isFitContent={false}
						className="border"
						type="text"
						name="max"
						placeholder={options.max.number}
						value={options.max.number}
						onChange={handleChange}
					/>
				</div>
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
					autoComplete="off"
				/>
				<div className={style.track}>
					<span
						style={{
							left: `${options.min.percent}%`,
						}}
						id="min"
						className={style.thumb}
					/>
					<span
						style={{
							left: `${options.max.percent}%`,
						}}
						id="max"
						className={style.thumb}
					/>
				</div>
			</div>
		</div>
	);
}

Range.defaultProps = {
	id: "",
	min: INPUT_MIN_VALUE,
	max: INPUT_MIN_VALUE,
};

Range.propTypes = {
	id: types.string,
	min: types.number,
	max: types.number,
	onChange: types.func.isRequired,
};

export default memo(Range);
