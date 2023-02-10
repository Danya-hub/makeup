import { useState } from "react";
import types from "prop-types";

import style from "./PasswordInput.module.css";

PasswordInput.propTypes = {
	className: types.string,
};

function PasswordInput({ className = "", ...props }) {
	const [isVisible, setVisible] = useState(false);

	function handleSwitchVisible() {
		setVisible(!isVisible);
	}

	return (
		<div className={`${style.wrapper} ${className} input`}>
			<input
				name="password"
				type={isVisible ? "text" : "password"}
				{...props}
			/>
			<button
				type="button"
				id={style.switchVisibleState}
				onClick={handleSwitchVisible}
			>
				<i
					className={`fa fa-${isVisible ? "eye" : "eye-slash"}`}
					aria-hidden="true"
				></i>
			</button>
		</div>
	);
}

export { PasswordInput as default };
