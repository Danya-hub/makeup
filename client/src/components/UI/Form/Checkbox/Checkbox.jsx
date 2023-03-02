import types from "prop-types";

import CheckSvg from "@/assets/image/check.svg";

import style from "./Checkbox.module.css";

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

Checkbox.propTypes = {
	text: types.string.isRequired,
	onCheck: types.func.isRequired,
};

export default Checkbox;
