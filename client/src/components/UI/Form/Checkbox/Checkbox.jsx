import { useTranslation } from "react-i18next";
import types from "prop-types";

import CheckSvg from "@/assets/image/check.svg";

import style from "./Checkbox.module.css";

function Checkbox({ className, text, checked, onCheck }) {
	const { t } = useTranslation();

	function handleCheck(e) {
		const isChecked = e.target.checked;

		onCheck(isChecked);
	}

	return (
		<label
			className={`${style.checkbox} ${className}`}
		>
			<input
				type="checkbox"
				checked={checked}
				style={{
					backgroundImage: `url(${CheckSvg})`,
				}}
				onChange={handleCheck}
			/>
			<span>{t(text)}</span>
		</label>
	);
}

Checkbox.defaultProps = {
	className: "",
	checked: false,
};

Checkbox.propTypes = {
	className: types.string,
	text: types.oneOfType([types.string, types.number]).isRequired,
	onCheck: types.func.isRequired,
	checked: types.bool,
};

export default Checkbox;
