import { useState, memo } from "react";
import types from "prop-types";

import StateInput from "@/components/UI/Form/StateInput/StateInput.jsx";

import style from "./PasswordInput.module.css";

function PasswordInput({
	className,
	id,
	name,
	onChange,
	hasSwitch,
	state,
	maxLength,
}) {
	const [isVisible, setVisible] = useState(!hasSwitch);

	function handleSwitchVisible() {
		setVisible(!isVisible);
	}

	return (
		<div className={`${style.passwordInput} ${className} input`}>
			<StateInput
				id={id}
				className={style.input}
				type={isVisible ? "text" : "password"}
				onChange={onChange}
				maxLength={maxLength}
				name={name}
				state={state}
			/>
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
	maxLength: types.number.isRequired,
	state: types.instanceOf(Object).isRequired,
};

export default memo(PasswordInput);
