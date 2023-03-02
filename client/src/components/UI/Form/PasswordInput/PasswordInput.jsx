import { useState } from "react";
import types from "prop-types";

import style from "./PasswordInput.module.css";

function PasswordInput({ className, id, name, maxLength, onBlur }) {
	const [isVisible, setVisible] = useState(false);

	function handleSwitchVisible() {
		setVisible(!isVisible);
	}

	return (
		<div className={`${style.wrapper} ${className} input`}>
			<input
				id={id}
				name={name}
				type={isVisible ? "text" : "password"}
				maxLength={maxLength}
				onBlur={onBlur}
			/>
			<button
				type="button"
				id={style.switchVisibleState}
				onClick={handleSwitchVisible}
			>
				<i
					className={`fa fa-${isVisible ? "eye" : "eye-slash"}`}
					aria-hidden="true"
				/>
			</button>
		</div>
	);
}

PasswordInput.defaultProps = {
	className: "",
	id: "",
};

PasswordInput.propTypes = {
	className: types.string,
	id: types.string,
	name: types.string.isRequired,
	maxLength: types.number.isRequired,
	onBlur: types.func.isRequired,
};

export default PasswordInput;
