import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import types from "prop-types";

import { actions, signin } from "@/service/redusers/user.js";
import Value from "@/helpers/value.js";

import { MAX_LENGTH_PASSWORD } from "@/constant/auth.js";

import Notification from "@/components/UI/Form/Notification/Notification.jsx";
import ChannelInput from "@/components/UI/Form/ChannelInput/ChannelInput.jsx";
import PasswordInput from "@/components/UI/Form/PasswordInput/PasswordInput.jsx";

import style from "@/pages/Auth/Auth.module.css";

Output.propTypes = {
	userState: types.array,
	passwordState: types.array,
};

function Output({ userState, passwordState }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { error } = useSelector((state) => state.user);
	const { state } = useLocation();

	const [user, setUser] = userState;
	const [, setPasswordForgotten] = passwordState;
	const purpose = state?.purpose || "adviceForAuth";

	async function handleSubmitForm(e) {
		e.preventDefault();

		const res = await dispatch(signin(user));

		if (res.error) {
			return;
		}

		navigate(-1);
	}

	function toSignup() {
		dispatch(actions.clearError());

		navigate("/signup", {
			state: {
				purpose,
			},
			replace: true,
		});
	}

	function handleResetPassword() {
		setPasswordForgotten(true);
	}

	return (
		<div id={style.auth}>
			<div className={style.form}>
				<h2 className={style.title}>{t("welcome")}</h2>
				<p className={`${style.message} ${style.left}`}>{t(purpose)}</p>
				{error && (
					<Notification
						text={error}
						status="error"
					></Notification>
				)}
				<form onSubmit={handleSubmitForm}>
					<div>
						<label htmlFor="channel">
							<h3 className="title">{`${t("email")} / ${t("telephone")}`}</h3>
						</label>
						<ChannelInput
							id="channel"
							type="text"
							className={style.field}
							onChange={setUser}
						></ChannelInput>
					</div>
					<div>
						<label htmlFor="password">
							<h3 className="title">{t("password")}</h3>
						</label>
						<PasswordInput
							id="password"
							className={`${style.field} input`}
							maxLength={MAX_LENGTH_PASSWORD}
							onBlur={(e) => Value.fromInput(e, setUser)}
						></PasswordInput>
					</div>
					<div className={style.forgotPassword}>
						<p>{t("forgotPassword")}</p>
						<button onClick={handleResetPassword}>{t("sendToEmail")}</button>
					</div>
					<div className={style.navigation}>
						<button
							type="submit"
							id={style.signIn}
							className="button border"
						>
							{t("signIn")}
						</button>
					</div>
				</form>
				<div className={style.authQueastion}>
					<p>{t("notHaveAccount")}</p>
					<button
						type="button"
						onClick={toSignup}
					>
						{t("signUp")}
					</button>
				</div>
			</div>
		</div>
	);
}

export { Output as default };
