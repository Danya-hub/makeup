import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import types from "prop-types";

import { sendLinkForResetingPassword } from "@/service/redusers/user.js";

import Notification from "@/components/UI/Form/Notification/Notification.jsx";

import style from "@/pages/Auth/Auth.module.css";

function Email({ userState, passwordState }) {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { error } = useSelector((state) => state.user);

	const [user] = userState;
	const [, setPasswordForgotten] = passwordState;

	const [email, setEmail] = useState(user.email || "");

	async function handleResetPassword(e) {
		e.preventDefault();

		const res = await dispatch(
			sendLinkForResetingPassword({
				email,
			}),
		);

		if (res.error) {
			return;
		}

		setPasswordForgotten(false);
	}

	function handleCancel() {
		setPasswordForgotten(false);
	}

	return (
		<div id={style.auth}>
			<div className={style.form}>
				<h2 className={style.title}>{t("resetPassword")}</h2>
				<p className={`${style.message} ${style.center}`}>{t("sendPasswordResetEmail")}</p>
				{error && (
					<Notification
						content={error}
						status="error"
					/>
				)}
				<form onSubmit={handleResetPassword}>
					<div>
						<label htmlFor="email">
							<h3 className="title">{t("email")}</h3>
						</label>
						<input
							id="email"
							type="email"
							name="email"
							className={`input ${style.field}`}
							defaultValue={email}
							onBlur={(e) => setEmail(e.currentTarget.value)}
						/>
					</div>
					<div className={style.navigation}>
						<button
							type="button"
							className="button border"
							id="cancel"
							onClick={handleCancel}
						>
							{t("cancel")}
						</button>
						<button
							type="submit"
							className="button border"
							id={style.submit}
						>
							{t("submit")}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

Email.propTypes = {
	userState: types.instanceOf(Array).isRequired,
	passwordState: types.instanceOf(Array).isRequired,
};

export default Email;
