import { useState, useEffect } from "react";
import types from "prop-types";

import style from "@/pages/Auth/Auth.module.css";

Confirm.propTypes = {
	formState: types.array,
};

const CONFIRM_PASSWORD_LENGTH = 6;
const MAX_LENGTH = 1;

function Confirm({ formState }) {
	const [password, setPassword] = useState(Array(CONFIRM_PASSWORD_LENGTH).fill(""));

	const [, setFormState] = formState;

	function handleCancel() {
		setFormState(false);
	}

	function handleChangeValue(i, e) {
		const value = e.currentTarget.value;
		const next = e.currentTarget.nextElementSibling;

		setPassword((password) => {
			password[i] = value;

			return [...password];
		});

		if (value && next) {
			next.focus();
		}
	}

	function handleKeyDown(i, e) {
		if (e.keyCode != 8) {
			return;
		}

		const prev = e.currentTarget.previousElementSibling;

		password[i] = "";
		setPassword(password);

		if (prev) {
			prev.focus();
		}
	}

	function getNewPassword(e) {
		e.preventDefault();
	}

	useEffect(() => {
		const isValid = password.every((symb) => symb !== "");

		if (isValid) {
			console.log(password.join("")); //!
		}
	}, [password]);

	return (
		<div id={style.confirm}>
			<div className={style.form}>
				<h2 className={style.title}>Потвердите пароль</h2>
				<p className={`${style.message} ${style.center}`}>
					Мы отправили сообщение на номер телефона, привязанный к этой учетной записи
				</p>
				{/* {error.msg && <p>{error.msg}</p>} */}
				<form>
					<div className={style.row}>
						{[...Array(CONFIRM_PASSWORD_LENGTH)].map((_, i) => (
							<input
								id={i}
								key={i + "/inp"}
								maxLength={MAX_LENGTH}
								value={password[i]}
								onChange={handleChangeValue.bind(null, i)}
								onKeyDown={handleKeyDown.bind(null, i)}
							></input>
						))}
					</div>
					<button
						type="button"
						className="button border"
						onClick={handleCancel}
					>
						Отмена
					</button>
				</form>
				<div className={style.question}>
					<p>Не получили код?</p>
					<button
						type="button"
						onClick={getNewPassword}
					>
						Отправить ещё
					</button>
				</div>
			</div>
		</div>
	);
}

export { Confirm as default };
