import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import types from "prop-types";

import Notification from "@/components/UI/Form/Notification/Notification.jsx";

import { sendPassword, checkPassword } from "@/service/redusers/user.js";
import { MAX_LENGTH_PASSWORD } from "@/constant/auth.js";

import style from "@/pages/Auth/Auth.module.css";

Confirm.propTypes = {
	formState: types.array,
	userState: types.array,
	onSuccess: types.func,
};

function Confirm({ formState, userState, onSuccess }) {
	const dispatch = useDispatch();
	const { error } = useSelector((state) => state.user);
	const { t } = useTranslation();

	const [, setFormState] = formState;
	const [user] = userState;

	function handleCancel() {
		setFormState(false);
	}

	function handleChangePassword(e) {
		const password = e.currentTarget.value;

		if (password.length !== MAX_LENGTH_PASSWORD) {
			return;
		}

		onCheckPassword(password);
	}

	function generateNewPassword() {
		dispatch(sendPassword(user));
	}

	async function onCheckPassword(password) {
		const res = await dispatch(
			checkPassword({
				...user,
				password,
			})
		);

		if (res.error) {
			return;
		}

		onSuccess(res.payload);
	}

	return (
		<div id={style.confirm}>
			<div className={style.form}>
				<h2 className={style.title}>{t("confirmPassword")}</h2>
				<p className={`${style.message} ${style.center}`}>
					{t("sendedMessage", {
						email: user.email,
					})}
				</p>
				{error && (
					<Notification
						text={error}
						status="error"
					></Notification>
				)}
				<form>
					<div>
						<label htmlFor="password">
							<h3 className="title">{t("password")}</h3>
						</label>
						<input
							id="password"
							type="text"
							className={`input ${style.field}`}
							name="password"
							maxLength={MAX_LENGTH_PASSWORD}
							onChange={handleChangePassword}
						/>
					</div>
					<button
						type="button"
						className="button border"
						onClick={handleCancel}
					>
						{t("cancel")}
					</button>
				</form>
				<div className={style.authQueastion}>
					<p>{t("forgotPassword")}</p>
					<button
						type="button"
						onClick={(e) => {
							e.preventDefault();

							generateNewPassword();
						}}
					>
						{t("sendMore")}
					</button>
				</div>
			</div>
		</div>
	);
}

export { Confirm as default };
