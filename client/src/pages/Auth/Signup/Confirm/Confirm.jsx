import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import types from "prop-types";

import Notification from "@/components/UI/Form/Notification/Notification.jsx";

import { sendPasswordForCompare, comparePassword } from "@/service/redusers/user.js";
import config from "@/pages/Auth/config/auth.js";

import style from "@/pages/Auth/Auth.module.css";

function Confirm({ formState, userState, onSuccess }) {
	const dispatch = useDispatch();
	const { error } = useSelector((state) => state.user);
	const { t } = useTranslation();

	const [, setFormState] = formState;
	const [user] = userState;

	function handleCancel() {
		setFormState(false);
	}

	async function onCheckPassword(password) {
		const res = await dispatch(
			comparePassword({
				...user,
				password,
			}),
		);

		if (res.error) {
			return;
		}

		onSuccess(res.payload);
	}

	function handleChangePassword(e) {
		const password = e.currentTarget.value;

		if (password.length !== config.MAX_LENGTH_PASSWORD) {
			return;
		}

		onCheckPassword(password);
	}

	function generateNewPassword() {
		dispatch(sendPasswordForCompare(user));
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
						content={error}
						status="error"
					/>
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
							maxLength={config.MAX_LENGTH_PASSWORD}
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

Confirm.propTypes = {
	formState: types.instanceOf(Array).isRequired,
	userState: types.instanceOf(Array).isRequired,
	onSuccess: types.func.isRequired,
};

export default Confirm;
