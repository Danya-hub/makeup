import { useState, memo } from "react";
import types from "prop-types";

import config from "@/pages/Auth/config/auth.js";

import StateInput from "@/components/UI/Form/StateInput/StateInput.jsx";

import style from "./PasswordInput.module.css";

function PasswordInput({
	className,
	id,
	name,
	onChange,
	hasSwitch,
	state,
}) {
	const [isVisible, setVisible] = useState(!hasSwitch);

	function handleSwitchVisible() {
		setVisible(!isVisible);
	}

	return (
		<div className={`${style.passwordInput} ${className} input`}>
			{hasSwitch && (
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
			)}
			<StateInput
				id={id}
				className={style.input}
				type={isVisible ? "text" : "password"}
				onChange={onChange}
				maxLength={config.MAX_LENGTH_PASSWORD}
				name={name}
				state={state}
			/>
		</div>
	);
}

PasswordInput.defaultProps = {
	className: "",
	id: "",
	hasSwitch: true,
};

PasswordInput.propTypes = {
	className: types.string,
	id: types.string,
	name: types.string.isRequired,
	onChange: types.func.isRequired,
	hasSwitch: types.bool,
	state: types.instanceOf(Object).isRequired,
};

export default memo(PasswordInput);
