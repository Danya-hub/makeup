import types from "prop-types";

import { default as CheckSvg } from "@/assets/image/check.svg";

import style from "./Checkbox.module.css";

Checkbox.propTypes = {
	text: types.string,
	onCheck: types.func,
};

function Checkbox({ text, onCheck }) {
	function handleCheck(e) {
		const isChecked = e.target.checked;

		onCheck(isChecked);
	}

	return (
		<label className={style.checkbox}>
			<input
				type="checkbox"
				style={{
					backgroundImage: `url(${CheckSvg})`,
				}}
				onChange={handleCheck}
			/>
			<span>{text}</span>
		</label>
	);
}

export { Checkbox as default };
