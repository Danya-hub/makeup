import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import Value from "@/helpers/value.js";
import { checkNewPassword } from "@/service/redusers/user.js";
import { MAX_LENGTH_PASSWORD } from "@/constant/auth.js";

import Notification from "@/components/UI/Form/Notification/Notification.jsx";
import PasswordInput from "@/components/UI/Form/PasswordInput/PasswordInput.jsx";

import style from "@/pages/Auth/Auth.module.css";

function ResetPassword() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { error } = useSelector((state) => state.user);

	const queries = new URLSearchParams(location.search);

	const [newPassword, setNewPassword] = useState({});

	async function handleSubmitForm(e) {
		e.preventDefault();

		const isSame = newPassword.password === newPassword.confirmedPassword;

		if (!isSame) {
			return;
		}

		const res = await dispatch(
			checkNewPassword({
				key: queries.get("key"),
				email: queries.get("email"),
				newPassword: newPassword.password,
			})
		);

		if (res.error) {
			return;
		}

		navigate("/appointment");
	}

	return (
		<div id={style.auth}>
			<div className={style.form}>
				<h2 className={style.title}>{t("changePassword")}</h2>
				<p className={`${style.message} ${style.center}`}>{t("enterPasswordAndConfirmIt")}</p>
				{error && (
					<Notification
						text={error}
						status="error"
					></Notification>
				)}
				<form onSubmit={handleSubmitForm}>
					<div>
						<label htmlFor="password">
							<h3 className="title">{t("password")}</h3>
						</label>
						<PasswordInput
							id="password"
							className={`input ${style.field}`}
							name="password"
							maxLength={MAX_LENGTH_PASSWORD}
							onBlur={(e) => Value.fromInput(e, setNewPassword)}
						></PasswordInput>
					</div>
					<div>
						<label htmlFor="confirmedPassword">
							<h3 className="title">{t("confirmPassword")}</h3>
						</label>
						<PasswordInput
							id="confirmedPassword"
							className={`input ${style.field}`}
							name="confirmedPassword"
							maxLength={MAX_LENGTH_PASSWORD}
							onBlur={(e) => Value.fromInput(e, setNewPassword)}
						></PasswordInput>
					</div>
					<div className={style.navigation}>
						<button
							type="submit"
							className="button border"
						>
							{t("change")}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export { ResetPassword as default };
