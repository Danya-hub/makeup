import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import types from "prop-types";

import Value from "@/helpers/value.js";
import { actions, asyncActions } from "@/service/redusers/user.js";

import Notification from "@/components/UI/Form/Notification/Notification.jsx";
import ChannelInput from "@/components/UI/Form/ChannelInput/ChannelInput.jsx";
import BirthSelector from "@/components/UI/BirthSelector/BirthSelector.jsx";

import style from "@/pages/Auth/Auth.module.css";

function Output({ userState, formState }) {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { state: locationState } = useLocation();
	const { error } = useSelector((state) => state.user);

	const [user, setUser] = userState;
	const [, setFormState] = formState;
	const purpose = locationState?.purpose || "adviceForAuth";

	async function handleSubmitForm(e) {
		e.preventDefault();

		const res = await dispatch(asyncActions.sendPasswordForCompare(user));

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
				<h1 className={style.title}>{t("signupAccount")}</h1>
				<p className={`${style.message} ${style.left}`}>{t(purpose)}</p>
				{error && (
					<Notification
						content={error}
						status="error"
					/>
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
							onChange={(e) => Value.fromInput(e, setUser)}
						/>
					</div>
					<div>
						<label htmlFor="email">
							<h3 className="title">{t("email")}</h3>
						</label>
						<ChannelInput
							id="email"
							strictIsTel={false}
							className={style.field}
							onChange={setUser}
						/>
					</div>
					<div>
						<label htmlFor="channel">
							<h3 className="title">{t("telephone")}</h3>
						</label>
						<ChannelInput
							strictIsTel
							id="telepephone"
							className={style.field}
							onChange={setUser}
						/>
					</div>
					<div>
						<label htmlFor="birthday">
							<h3 className="title">{t("birthday")}</h3>
						</label>
						<BirthSelector
							id="birthday"
							className={style.field}
							onChange={(date) => {
								setUser((prev) => {
									const state = prev;

									state.birthday = date;

									return {
										...prev,
									};
								});
							}}
						/>
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

Output.propTypes = {
	userState: types.instanceOf(Array).isRequired,
	formState: types.instanceOf(Array).isRequired,
};

export default Output;
