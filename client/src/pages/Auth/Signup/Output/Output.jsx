import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import types from "prop-types";

import Value from "@/helpers/value.js";
import { actions, sendPassword } from "@/service/redusers/user.js";

import Notification from "@/components/UI/Form/Notification/Notification.jsx";
import ChannelInput from "@/components/UI/Form/ChannelInput/ChannelInput.jsx";

import style from "@/pages/Auth/Auth.module.css";

Output.propTypes = {
	userState: types.array,
	formState: types.array,
};

function Output({ userState, formState }) {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { state } = useLocation();
	const { error } = useSelector((state) => state.user);

	const [user, setUser] = userState;
	const [, setFormState] = formState;
	const purpose = state?.purpose || "adviceForAuth";

	async function handleSubmitForm(e) {
		e.preventDefault();

		const res = await dispatch(sendPassword(user));

		if (res.error) {
			return;
		}

		setFormState(true);
	}

	function toSignin() {
		dispatch(actions.clearError());

		navigate("/signin", {
			state: {
				purpose,
			},
			replace: true,
		});
	}

	return (
		<div id={style.auth}>
			<div className={style.form}>
				<h2 className={style.title}>{t("signupAccount")}</h2>
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
							<h3 className="title">{t("fullname")}</h3>
						</label>
						<input
							type="text"
							className={`input ${style.field}`}
							name="fullname"
							onBlur={(e) => Value.fromInput(e, setUser)}
						></input>
					</div>
					<div>
						<label htmlFor="channel">
							<h3 className="title">{t("email")}</h3>
						</label>
						<input
							type="email"
							className={`input ${style.field}`}
							name="email"
							onBlur={(e) => Value.fromInput(e, setUser)}
						></input>
					</div>
					<div>
						<label htmlFor="channel">
							<h3 className="title">{t("telephone")}</h3>
						</label>
						<ChannelInput
							strictIsTel={true}
							id="channel"
							type="text"
							className={style.field}
							onChange={setUser}
						></ChannelInput>
					</div>
					<div className={style.navigation}>
						<button
							type="submit"
							id={style.signUp}
							className="button border"
						>
							{t("signUp")}
						</button>
					</div>
				</form>
				<div className={style.authQueastion}>
					<p>{t("alreadyExistsAccount")}</p>
					<button
						type="button"
						onClick={toSignin}
					>
						{t("signIn")}
					</button>
				</div>
			</div>
		</div>
	);
}

export { Output as default };
