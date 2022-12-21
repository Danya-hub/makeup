import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { signup, actions } from "@/service/redusers/user.js";
import changePropertyValue from "@/helpers/changePropertyValue.js";

import GoogleSignin from "@/components/UI/Form/GoogleSignin/GoogleSignin.jsx";

import style from "@/pages/Auth/Auth.module.css";

function Signup() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { error } = useSelector((state) => state.user);
	const { state } = useLocation();

	const [newUser, setUser] = useState({});

	function valueFromInput(e, callback) {
		const t = e.target;

		changePropertyValue({
			[t.name]: t.value,
		}, callback);
	}

	async function onSignup() {
		const res = await dispatch(signup(newUser));

		if (res.meta.rejectedWithValue) {
			return;
		}

		dispatch(actions.clearError());
		navigate("/signin", {
			replace: true,
			state: {
				purpose: state?.purpose,
			},
		});
	}

	return (
		<div id={style.auth}>
			<aside>
				<h2>{t("welcome")}</h2>
				<p>{t(state?.purpose)}</p>
				<button
					type="button"
					className="button border"
					onClick={() => {
						dispatch(actions.clearError());
						navigate("/signin", {
							replace: true,
							state: {
								purpose: state?.purpose,
							},
						});
					}}
				>
					{t("signIn")}
				</button>
			</aside>
			<div id={style.form}>
				<div className={style.wrapper}>
					<h2>{t("signupAccount")}</h2>
					{error?.msg && <p>{error?.msg}</p>}
					<form
						onSubmit={async (e) => {
							e.preventDefault();
							await onSignup();
						}}
					>
						<label>
							<h3 className="title">{t("fullname")}</h3>
							<input
								type="text"
								name="fullname"
								onBlur={(e) => valueFromInput(e, setUser)}
							></input>
						</label>
						<label>
							<h3 className="title">{t("telephone")}</h3>
							<input
								type="tel"
								name="telephone"
								onBlur={(e) => valueFromInput(e, setUser)}
							></input>
						</label>
						<button
							type="submit"
							className="button border"
						>
							{t("signUp")}
						</button>
					</form>
					<div id={style.or}>
						<span>{t("or")}</span>
					</div>
					<div id={style.other}>
						<GoogleSignin onSuccess={onSignup}></GoogleSignin>
					</div>
				</div>
			</div>
		</div>
	);
}

export { Signup as default };
